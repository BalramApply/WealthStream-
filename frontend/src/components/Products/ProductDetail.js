import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ProductDetails.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [units, setUnits] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    if (isAuthenticated) {
      checkWatchlistStatus();
    }
  }, [id, isAuthenticated]);

  // Fixed useEffect for calculating units
  useEffect(() => {
    if (product && investmentAmount && investmentAmount !== '') {
      const amount = parseFloat(investmentAmount);
      if (!isNaN(amount) && amount > 0) {
        const calculatedUnits = Math.floor(amount / product.pricePerUnit);
        setUnits(calculatedUnits);
      } else {
        setUnits(0);
      }
    } else {
      setUnits(0);
    }
  }, [investmentAmount, product]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch product details');
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const response = await api.get('/portfolio/watchlist');
      const watchlist = response.data.watchlist;
      setIsInWatchlist(watchlist.some(item => item._id === id));
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user.isKYCCompleted) {
      navigate('/kyc');
      return;
    }

    if (units <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    const totalAmount = units * product.pricePerUnit;
    if (totalAmount > user.wallet.balance) {
      alert('Insufficient balance in your wallet');
      return;
    }

    setPurchasing(true);
    try {
      await api.post('/transactions/buy', {
        productId: product._id,
        units
      });
      
      alert('Purchase successful!');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isInWatchlist) {
        await api.delete(`/portfolio/watchlist/${product._id}`);
        setIsInWatchlist(false);
        alert('Removed from watchlist');
      } else {
        await api.post('/portfolio/watchlist', { productId: product._id });
        setIsInWatchlist(true);
        alert('Added to watchlist');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  // Handle investment amount change with validation
  const handleInvestmentAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInvestmentAmount(value);
    }
  };

  // Prepare chart data
  const getChartData = () => {
    if (!product?.historicalData) return null;

    const sortedData = [...product.historicalData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedData.map(data => new Date(data.date).toLocaleDateString('en-IN')),
      datasets: [
        {
          label: 'Price (₹)',
          data: sortedData.map(data => data.price),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  const chartData = getChartData();

  // Calculate values for display
  const totalCost = units * product.pricePerUnit;
  const remainingBalance = user ? user.wallet.balance - totalCost : 0;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-header-detail">
          <div className="product-info-main">
            <h1>{product.name}</h1>
            <p className="product-symbol-large">{product.symbol}</p>
            <div className="product-category-badge">
              {product.category.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          
          <div className="product-price-main">
            <div className="current-price">
              <span className="currency">₹</span>
              <span className="amount">{product.pricePerUnit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <p className="per-unit">per unit</p>
          </div>
        </div>

        <div className="product-details-grid">
          <div className="product-info-section">
            <h3>Product Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Risk Level:</label>
                <span className={`risk-level ${product.riskLevel}`}>
                  {product.riskLevel?.toUpperCase()}
                </span>
              </div>
              
              {product.keyMetric && (
                <div className="info-item">
                  <label>{product.keyMetric.name}:</label>
                  <span>
                    {product.keyMetric.name === 'Yield' ? `${product.keyMetric.value}%` : product.keyMetric.value}
                  </span>
                </div>
              )}
              
              {product.description && (
                <div className="info-item description">
                  <label>Description:</label>
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {chartData && (
            <div className="chart-section">
              <h3>Price Chart</h3>
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="investment-section">
            <h3>Investment Calculator</h3>
            <div className="investment-form">
              <div className="form-group">
                <label htmlFor="investment-amount">Investment Amount (₹)</label>
                <input
                  type="text"
                  id="investment-amount"
                  value={investmentAmount}
                  onChange={handleInvestmentAmountChange}
                  placeholder="Enter amount to invest"
                />
                <small>Minimum investment: ₹{product.pricePerUnit.toFixed(2)} (1 unit)</small>
              </div>
              
              <div className="investment-summary">
                <p><strong>Units to purchase:</strong> {units}</p>
                <p><strong>Total cost:</strong> ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                {user && (
                  <p><strong>Remaining balance:</strong> 
                    <span style={{ color: remainingBalance < 0 ? '#dc3545' : '#28a745' }}>
                      ₹{remainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </p>
                )}
                {remainingBalance < 0 && (
                  <p style={{ color: '#dc3545', fontSize: '14px' }}>
                    <strong>⚠️ Insufficient balance!</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="product-actions-detail">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleWatchlistToggle}
                className={`btn ${isInWatchlist ? 'btn-outline' : 'btn-secondary'}`}
                disabled={purchasing}
              >
                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
              
              <button
                onClick={handlePurchase}
                disabled={!investmentAmount || units <= 0 || purchasing || remainingBalance < 0}
                className="btn btn-primary"
              >
                {purchasing ? 'Processing...' : `Buy ${units} Unit${units !== 1 ? 's' : ''}`}
              </button>
            </>
          ) : (
            <div className="auth-prompt">
              <p>Please log in to invest in this product</p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;