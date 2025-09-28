const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  holdings: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    units: {
      type: Number,
      required: true
    },
    avgBuyPrice: {
      type: Number,
      required: true
    },
    totalInvested: {
      type: Number,
      required: true
    }
  }],
  totalInvestment: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);