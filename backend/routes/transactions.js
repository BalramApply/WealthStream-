const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// @route   POST /api/transactions/buy
// @desc    Buy a product
// @access  Private
router.post('/buy', auth, transactionController.buyProduct);

// @route   GET /api/transactions
// @desc    Get user transactions
// @access  Private
router.get('/', auth, transactionController.getTransactions);

// @route   POST /api/transactions/sell
// @desc    Sell a product
// @access  Private
router.post('/sell', auth, transactionController.sellProduct);

module.exports = router;