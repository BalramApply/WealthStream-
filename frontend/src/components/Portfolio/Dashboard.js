import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Dashboard.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch portfolio data
      const portfolioResponse = await api.get('/portfolio');
      setPortfolio(portfolioResponse.data.portfolio);
      setSummary(portfolioResponse.data.summary);

      // Fetch recent transactions
      const transactionsResponse = await api.get('/transactions');
      setRecentTransactions(transactionsResponse.data.transactions.slice(0, 5));
      
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  // Prepare portfolio allocation chart data
  const getPortfolioChartData = () => {
    if (!portfolio?.holdings || portfolio.holdings.length === 0) return null;

    const labels = portfolio.holdings.map(holding => holding.product.name);
    const data = portfolio.holdings.map(holding => holding.totalInvested);
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }
      ]
    };
  };

  // Prepare performance chart data
  const getPerformanceChartData = () => {
    if (!portfolio?.holdings || portfolio.holdings.length === 0) return null;

    const labels = portfolio.holdings.map(holding => holding.product.symbol);
    const invested = portfolio.holdings.map(holding => holding.totalInvested);
    const current = portfolio.holdings.map(holding => 
      holding.units * holding.product.pricePerUnit
    );

    return {
      labels,
      datasets: [
        {
          label: 'Invested Amount',
          data: invested,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
        },
        {
          label: 'Current Value',
          data: current,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const portfolioChartData = getPortfolioChartData();
  const performanceChartData = getPerformanceChartData();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Portfolio Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {!user?.isKYCCompleted && (
        <div className="kyc-warning">
          <p>⚠️ Please complete your KYC to start investing</p>
          <Link to="/kyc" className="btn btn-primary">Complete KYC</Link>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">₹{user?.wallet?.balance?.toLocaleString('en-IN') || '0'}</div>
          <div className="stat-label">Wallet Balance</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">₹{summary?.totalInvested?.toLocaleString('en-IN') || '0'}</div>
          <div className="stat-label">Total Invested</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">₹{summary?.currentValue?.toLocaleString('en-IN') || '0'}</div>
          <div className="stat-label">Current Value</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ 
            color: summary?.returns >= 0 ? '#28a745' : '#dc3545' 
          }}>
            {summary?.returns >= 0 ? '+' : ''}₹{summary?.returns?.toLocaleString('en-IN') || '0'}
          </div>
          <div className="stat-label">
            Total Returns ({summary?.returnsPercentage || '0'}%)
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>Portfolio Allocation</h3>
          {portfolioChartData ? (
            <div className="chart-container">
              <Doughnut data={portfolioChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="empty-state">
              <p>No investments yet</p>
              <Link to="/products" className="btn btn-primary">Start Investing</Link>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h3>Performance Overview</h3>
          {performanceChartData ? (
            <div className="chart-container">
              <Bar data={performanceChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="empty-state">
              <p>No performance data available</p>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h3>Holdings</h3>
          {portfolio?.holdings?.length > 0 ? (
            <div className="holdings-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units</th>
                    <th>Avg. Price</th>
                    <th>Current Price</th>
                    <th>Invested</th>
                    <th>Current Value</th>
                    <th>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((holding) => {
                    const currentValue = holding.units * holding.product.pricePerUnit;
                    const pnl = currentValue - holding.totalInvested;
                    const pnlPercentage = ((pnl / holding.totalInvested) * 100).toFixed(2);
                    
                    return (
                      <tr key={holding._id}>
                        <td>
                          <div className="product-cell">
                            <strong>{holding.product.name}</strong>
                            <small>{holding.product.symbol}</small>
                          </div>
                        </td>
                        <td>{holding.units}</td>
                        <td>₹{holding.avgBuyPrice.toFixed(2)}</td>
                        <td>₹{holding.product.pricePerUnit.toFixed(2)}</td>
                        <td>₹{holding.totalInvested.toLocaleString('en-IN')}</td>
                        <td>₹{currentValue.toLocaleString('en-IN')}</td>
                        <td className={pnl >= 0 ? 'positive' : 'negative'}>
                          {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN')}
                          <br />
                          <small>({pnlPercentage}%)</small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No holdings yet</p>
              <Link to="/products" className="btn btn-primary">Explore Products</Link>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h3>Recent Transactions</h3>
          {recentTransactions.length > 0 ? (
            <div className="transactions-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction._id} className="transaction-item">

                  
                  <div className="transaction-info">

                    <strong>{transaction.product.name}</strong>
                    
                    <span className={`transaction-type transaction-item ${transaction.type === 'buy' ? 'buy' : 'sell'}`}>{transaction.type.toUpperCase()}</span>
                    </div>
                  
                  <div className="transaction-details">
                    <span>{transaction.units} units @ ₹{transaction.pricePerUnit}</span>
                    <span className="transaction-amount">₹{transaction.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="transaction-date">
                    {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                
              ))}
              <Link to="/transactions" className="view-all-link">View All Transactions</Link>
            </div>
          ) : (
            <div className="empty-state">
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;