import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../../services/api';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'mutual_funds', label: 'Mutual Funds' },
    { value: 'bonds', label: 'Bonds' }
  ];

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Investment Products</h1>
        <p>Explore our range of investment opportunities</p>
      </div>

      <div className="filter-section">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="no-products">
            <p>No products found for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;