const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['stocks', 'mutual_funds', 'bonds']
  },
  symbol: {
    type: String,
    required: true,
    unique: true
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  keyMetric: {
    name: String, // e.g., "P/E Ratio", "Expense Ratio"
    value: Number
  },
  description: String,
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  historicalData: [{
    date: Date,
    price: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);