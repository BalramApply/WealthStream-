import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">💰</span>
          <span className="logo-text">Wealth Stream</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <div className="nav-links">
            <Link to="/products" className="nav-link" onClick={closeMenu}>
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={closeMenu}>
                  Dashboard
                </Link>
                <Link to="/watchlist" className="nav-link" onClick={closeMenu}>
                  Watchlist
                </Link>
                <Link to="/transactions" className="nav-link" onClick={closeMenu}>
                  Transactions
                </Link>
                
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-balance">
                      ₹{user?.wallet?.balance?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                  
                  {!user?.isKYCCompleted && (
                    <div className="kyc-alert">
                      <Link to="/kyc" className="kyc-link" onClick={closeMenu}>
                        Complete KYC
                      </Link>
                    </div>
                  )}
                  
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;