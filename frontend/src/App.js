import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import PrivateRoute from './components/Common/PrivateRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import KYCForm from './components/auth/KYCForm';

// Product Components
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';

// Portfolio Components
import Dashboard from './components/Portfolio/Dashboard';
import TransactionHistory from './components/Portfolio/TransactionHistory';
import Watchlist from './components/Portfolio/Watchlist';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              
              {/* Private Routes */}
              <Route path="/kyc" element={
                <PrivateRoute>
                  <KYCForm />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/transactions" element={
                <PrivateRoute>
                  <TransactionHistory />
                </PrivateRoute>
              } />
              <Route path="/watchlist" element={
                <PrivateRoute>
                  <Watchlist />
                </PrivateRoute>
              } />
              
              {/* Default Route */}
              <Route path="/" element={<ProductList />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;