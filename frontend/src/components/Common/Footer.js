import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-brand">
            <span className="logo-icon">💰</span>
            <span className="logo-text">FinanceApp</span>
          </div>
          <p className="footer-description">
            Your trusted platform for smart investments and financial growth.
            Start building your portfolio today with our diverse range of 
            investment products.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/products">Investment Products</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/watchlist">Watchlist</Link></li>
            <li><Link to="/transactions">Transactions</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <ul className="footer-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
            <li><Link to="/kyc">Complete KYC</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Investment Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=stocks">Stocks</Link></li>
            <li><Link to="/products?category=mutual_funds">Mutual Funds</Link></li>
            <li><Link to="/products?category=bonds">Bonds</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal & Support</h4>
          <ul className="footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#support">Customer Support</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} FinanceApp. All rights reserved.</p>
            <div className="footer-disclaimers">
              <small>
                Investments are subject to market risks. Please read all scheme 
                related documents carefully before investing. Past performance 
                is not indicative of future results.
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;