const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, addReview);

router.route('/service/:serviceId')
    .get(getReviews);

module.exports = router;
