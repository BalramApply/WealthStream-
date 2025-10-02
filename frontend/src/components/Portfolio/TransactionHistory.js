import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [transactions, filter, sortBy]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch transactions');
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...transactions];

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-desc':
          return b.totalAmount - a.totalAmount;
        case 'amount-asc':
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  };

  const getTransactionTypeColor = (type) => {
    return type === 'buy' ? '#28a745' : '#dc3545';
  };

  const calculateTotalInvested = () => {
    return transactions
      .filter(t => t.type === 'buy')
      .reduce((total, t) => total + t.totalAmount, 0);
  };

  const calculateTotalWithdrawn = () => {
    return transactions
      .filter(t => t.type === 'sell')
      .reduce((total, t) => total + t.totalAmount, 0);
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Transaction History</h1>
        <div className="transaction-summary">
          <div className="summary-item">
            <span className="summary-label">Total Invested:</span>
            <span className="summary-value positive">
              ₹{calculateTotalInvested().toLocaleString('en-IN')}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Withdrawn:</span>
            <span className="summary-value negative">
              ₹{calculateTotalWithdrawn().toLocaleString('en-IN')}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Net Investment:</span>
            <span className="summary-value">
              ₹{(calculateTotalInvested() - calculateTotalWithdrawn()).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="transactions-controls">
        <div className="filter-group">
          <label htmlFor="transaction-filter">Filter by Type:</label>
          <select
            id="transaction-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="buy">Buy Only</option>
            <option value="sell">Sell Only</option>
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="transaction-sort">Sort by:</label>
          <select
            id="transaction-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Product</th>
                <th>Type</th>
                <th>Units</th>
                <th>Price per Unit</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="transaction-date">
                    <div>
                      {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                    </div>
                    <small>
                      {new Date(transaction.createdAt).toLocaleTimeString('en-IN')}
                    </small>
                  </td>
                  <td className="product-info">
                    <div className="product-name">{transaction.product.name}</div>
                    <small className="product-symbol">{transaction.product.symbol}</small>
                  </td>
                  <td>
                    <span 
                      className="transaction-type-badge"
                      style={{ 
                        backgroundColor: getTransactionTypeColor(transaction.type),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td>{transaction.units}</td>
                  <td>₹{transaction.pricePerUnit.toFixed(2)}</td>
                  <td className="transaction-amount">
                    <span style={{ color: getTransactionTypeColor(transaction.type) }}>
                      {transaction.type === 'buy' ? '-' : '+'}₹{transaction.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${transaction.status}`}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No transactions found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't made any transactions yet." 
              : `No ${filter} transactions found.`
            }
          </p>
          {filter === 'all' && (
            <a href="/products" className="btn btn-primary">
              Start Investing
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;