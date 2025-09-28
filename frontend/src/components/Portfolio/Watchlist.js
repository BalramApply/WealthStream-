import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
// import './Portfolio.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await api.get('/portfolio/watchlist');
      setWatchlist(response.data.watchlist);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch watchlist');
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (productId) => {
    try {
      await api.delete(`/portfolio/watchlist/${productId}`);
      setWatchlist(watchlist.filter(item => item._id !== productId));
    } catch (error) {
      alert('Failed to remove from watchlist');
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'stocks':
        return 'Stock';
      case 'mutual_funds':
        return 'Mutual Fund';
      case 'bonds':
        return 'Bond';
      default:
        return 'Investment';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return '#28a745';
      case 'medium':
        return '#ffc107';
      case 'high':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return <div className="loading">Loading watchlist...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <p>Keep track of your favorite investment products</p>
      </div>

      {watchlist.length > 0 ? (
        <div className="watchlist-grid">
          {watchlist.map((product) => (
            <div key={product._id} className="watchlist-card">
              <div className="watchlist-card-header">
                <div className="product-category">
                  {getCategoryLabel(product.category)}
                </div>
                <div 
                  className="risk-badge"
                  style={{ backgroundColor: getRiskColor(product.riskLevel) }}
                >
                  {product.riskLevel?.toUpperCase()} RISK
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromWatchlist(product._id)}
                  title="Remove from watchlist"
                >
                  ×
                </button>
              </div>

              <div className="watchlist-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-symbol">{product.symbol}</p>
                
                <div className="product-price">
                  <span className="currency">₹</span>
                  <span className="amount">
                    {product.pricePerUnit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="unit">per unit</span>
                </div>

                {product.keyMetric && (
                  <div className="key-metric">
                    <span className="metric-name">{product.keyMetric.name}:</span>
                    <span className="metric-value">
                      {product.keyMetric.name === 'Yield' 
                        ? `${product.keyMetric.value}%` 
                        : product.keyMetric.value}
                    </span>
                  </div>
                )}

                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
              </div>

              <div className="watchlist-actions">
                <Link 
                  to={`/products/${product._id}`}
                  className="btn btn-outline"
                >
                  View Details
                </Link>
                <Link 
                  to={`/products/${product._id}`}
                  className="btn btn-primary"
                >
                  Invest Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👁️</div>
          <h3>Your watchlist is empty</h3>
          <p>Add products to your watchlist to keep track of them</p>
          <Link to="/products" className="btn btn-primary">
            Explore Products
          </Link>
        </div>
      )}

      <div className="watchlist-info">
        <h3>About Watchlist</h3>
        <ul>
          <li>Keep track of products you're interested in</li>
          <li>Monitor price changes and performance</li>
          <li>Quick access to invest when you're ready</li>
          <li>No limit on the number of products you can watch</li>
        </ul>
      </div>
    </div>
  );
};

export default Watchlist;