const Portfolio = require('../models/Portfolio');
const Product = require('../models/Product');
const User = require('../models/User');

// Get user portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    let portfolio = await Portfolio.findOne({ user: userId })
      .populate('holdings.product');

    if (!portfolio) {
      portfolio = new Portfolio({ user: userId, holdings: [] });
      await portfolio.save();
    }

    // Calculate current value
    let currentValue = 0;
    for (let holding of portfolio.holdings) {
      currentValue += holding.units * holding.product.pricePerUnit;
    }

    portfolio.currentValue = currentValue;
    await portfolio.save();

    const returns = currentValue - portfolio.totalInvestment;
    const returnsPercentage = portfolio.totalInvestment > 0 
      ? ((returns / portfolio.totalInvestment) * 100).toFixed(2)
      : 0;

    res.json({
      portfolio,
      summary: {
        totalInvested: portfolio.totalInvestment,
        currentValue,
        returns,
        returnsPercentage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add to watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    
    if (!user.watchlist.includes(productId)) {
      user.watchlist.push(productId);
      await user.save();
    }

    res.json({ message: 'Added to watchlist successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove from watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    user.watchlist = user.watchlist.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ message: 'Removed from watchlist successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('watchlist');
    
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};