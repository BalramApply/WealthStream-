const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

// @route   GET /api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', auth, portfolioController.getPortfolio);

// @route   POST /api/portfolio/watchlist
// @desc    Add to watchlist
// @access  Private
router.post('/watchlist', auth, portfolioController.addToWatchlist);

// @route   DELETE /api/portfolio/watchlist/:productId
// @desc    Remove from watchlist
// @access  Private
router.delete('/watchlist/:productId', auth, portfolioController.removeFromWatchlist);

// @route   GET /api/portfolio/watchlist
// @desc    Get watchlist
// @access  Private
router.get('/watchlist', auth, portfolioController.getWatchlist);

module.exports = router;