const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequests,
    updateRequestStatus,
    getTransactions
} = require('../controllers/request.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

// Original: router.route('/').post(createRequest).get(getRequests);
// Refactored to individual routes with explicit protect middleware
router.post('/', createRequest);
router.get('/', getRequests);

// New route for transactions
router.get('/transactions', getTransactions);

// Original: router.route('/:id/status').put(updateRequestStatus);
// Refactored to individual route with explicit protect middleware
router.put('/:id/status', updateRequestStatus);

module.exports = router;
