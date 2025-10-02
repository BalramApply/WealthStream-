const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Product = require('../models/Product');

// Buy Product
exports.buyProduct = async (req, res) => {
  try {
    const { productId, units } = req.body;
    const userId = req.user.userId;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const totalAmount = units * product.pricePerUnit;

    // Check user balance
    const user = await User.findById(userId);
    if (user.wallet.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create transaction
    const transaction = new Transaction({
      user: userId,
      product: productId,
      type: 'buy',
      units,
      pricePerUnit: product.pricePerUnit,
      totalAmount
    });

    await transaction.save();

    // Update user wallet
    user.wallet.balance -= totalAmount;
    await user.save();

    // Update or create portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      portfolio = new Portfolio({ user: userId, holdings: [] });
    }

    const existingHolding = portfolio.holdings.find(
      h => h.product.toString() === productId
    );

    if (existingHolding) {
      // Update existing holding
      const newTotalInvested = existingHolding.totalInvested + totalAmount;
      const newTotalUnits = existingHolding.units + units;
      existingHolding.avgBuyPrice = newTotalInvested / newTotalUnits;
      existingHolding.units = newTotalUnits;
      existingHolding.totalInvested = newTotalInvested;
    } else {
      // Add new holding
      portfolio.holdings.push({
        product: productId,
        units,
        avgBuyPrice: product.pricePerUnit,
        totalInvested: totalAmount
      });
    }

    // Update portfolio totals
    portfolio.totalInvestment += totalAmount;
    await portfolio.save();

    res.json({
      message: 'Purchase successful',
      transaction: await transaction.populate('product'),
      remainingBalance: user.wallet.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user transactions
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.find({ user: userId })
      .populate('product')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Sell Product
exports.sellProduct = async (req, res) => {
  try {
    const { productId, units } = req.body;
    const userId = req.user.userId;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const totalAmount = units * product.pricePerUnit;

    // Find portfolio
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      return res.status(400).json({ message: 'No portfolio found' });
    }

    // Check existing holding
    const holding = portfolio.holdings.find(
      h => h.product.toString() === productId
    );
    if (!holding || holding.units < units) {
      return res.status(400).json({ message: 'Not enough units to sell' });
    }

    // Create transaction
    const transaction = new Transaction({
      user: userId,
      product: productId,
      type: 'sell',
      units,
      pricePerUnit: product.pricePerUnit,
      totalAmount
    });
    await transaction.save();

    // Update holding
    holding.units -= units;
    holding.totalInvested = holding.units * holding.avgBuyPrice;

    // Remove holding if units reach 0
    if (holding.units === 0) {
      portfolio.holdings = portfolio.holdings.filter(
        h => h.product.toString() !== productId
      );
    }

    // Update portfolio totals
    portfolio.totalInvestment = portfolio.holdings.reduce(
      (sum, h) => sum + h.totalInvested,
      0
    );
    await portfolio.save();

    // Update user wallet (credit sale amount)
    const user = await User.findById(userId);
    user.wallet.balance += totalAmount;
    await user.save();

    res.json({
      message: 'Sell successful',
      transaction: await transaction.populate('product'),
      updatedBalance: user.wallet.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
