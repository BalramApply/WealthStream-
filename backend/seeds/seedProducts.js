const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    name: 'Reliance Industries Ltd',
    category: 'stocks',
    symbol: 'RELIANCE',
    pricePerUnit: 2450.50,
    keyMetric: { name: 'P/E Ratio', value: 15.2 },
    description: 'India\'s largest private sector company',
    riskLevel: 'medium',
    historicalData: [
      { date: new Date('2024-01-01'), price: 2300 },
      { date: new Date('2024-02-01'), price: 2350 },
      { date: new Date('2024-03-01'), price: 2400 },
      { date: new Date('2024-04-01'), price: 2450.50 }
    ]
  },
  {
    name: 'HDFC Bank Ltd',
    category: 'stocks',
    symbol: 'HDFCBANK',
    pricePerUnit: 1650.75,
    keyMetric: { name: 'P/E Ratio', value: 18.5 },
    description: 'Leading private sector bank',
    riskLevel: 'low',
    historicalData: [
      { date: new Date('2024-01-01'), price: 1600 },
      { date: new Date('2024-02-01'), price: 1625 },
      { date: new Date('2024-03-01'), price: 1640 },
      { date: new Date('2024-04-01'), price: 1650.75 }
    ]
  },
  {
    name: 'SBI Bluechip Fund',
    category: 'mutual_funds',
    symbol: 'SBIBLUECHIP',
    pricePerUnit: 85.40,
    keyMetric: { name: 'Expense Ratio', value: 0.65 },
    description: 'Large cap equity mutual fund',
    riskLevel: 'medium',
    historicalData: [
      { date: new Date('2024-01-01'), price: 80 },
      { date: new Date('2024-02-01'), price: 82 },
      { date: new Date('2024-03-01'), price: 84 },
      { date: new Date('2024-04-01'), price: 85.40 }
    ]
  },
  {
    name: 'ICICI Prudential Technology Fund',
    category: 'mutual_funds',
    symbol: 'ICICITECH',
    pricePerUnit: 142.20,
    keyMetric: { name: 'Expense Ratio', value: 0.85 },
    description: 'Technology sector focused fund',
    riskLevel: 'high',
    historicalData: [
      { date: new Date('2024-01-01'), price: 130 },
      { date: new Date('2024-02-01'), price: 135 },
      { date: new Date('2024-03-01'), price: 140 },
      { date: new Date('2024-04-01'), price: 142.20 }
    ]
  },
  {
    name: 'Government Bond 2025',
    category: 'bonds',
    symbol: 'GOVBOND2025',
    pricePerUnit: 1000.00,
    keyMetric: { name: 'Yield', value: 6.8 },
    description: 'Government of India Bond',
    riskLevel: 'low',
    historicalData: [
      { date: new Date('2024-01-01'), price: 1000 },
      { date: new Date('2024-02-01'), price: 1000 },
      { date: new Date('2024-03-01'), price: 1000 },
      { date: new Date('2024-04-01'), price: 1000 }
    ]
  }
];

const seedProducts = async () => {
  try {
    await Product.deleteMany({}); // Clear existing products
    await Product.insertMany(products);
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = seedProducts;