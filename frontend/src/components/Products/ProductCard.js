import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();

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

  return (
    <div className="product-card">
      <div className="product-header">
        <div className="product-category">
          {getCategoryLabel(product.category)}
        </div>
        <div 
          className="risk-badge"
          style={{ backgroundColor: getRiskColor(product.riskLevel) }}
        >
          {product.riskLevel?.toUpperCase()} RISK
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-symbol">{product.symbol}</p>
        
        <div className="product-price">
          <span className="currency">₹</span>
          <span className="amount">{product.pricePerUnit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="unit">per unit</span>
        </div>

        {product.keyMetric && (
          <div className="key-metric">
            <span className="metric-name">{product.keyMetric.name}:</span>
            <span className="metric-value">
              {product.keyMetric.name === 'Yield' ? `${product.keyMetric.value}%` : product.keyMetric.value}
            </span>
          </div>
        )}

        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
      </div>

      <div className="product-actions">
        <Link 
          to={`/products/${product._id}`}
          className="btn btn-outline"
        >
          View Details
        </Link>
        
        {isAuthenticated && (
          <Link 
            to={`/products/${product._id}`}
            className="btn btn-primary"
          >
            Invest Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;