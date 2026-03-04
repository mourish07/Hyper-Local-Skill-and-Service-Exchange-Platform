const Review = require('../models/Review');
const Request = require('../models/Request');
const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        const { serviceId, rating, comment } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check if user has requested and completed this service
        const request = await Request.findOne({
            service: serviceId,
            requester: req.user.id,
            status: 'completed'
        });

        if (!request) {
            return res.status(400).json({ message: 'You can only review completed services that you requested' });
        }

        // Check if already reviewed
        const alreadyReviewed = await Review.findOne({
            service: serviceId,
            reviewer: req.user.id
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this service' });
        }

        const review = await Review.create({
            reviewer: req.user.id,
            reviewee: service.provider,
            service: serviceId,
            rating,
            comment
        });

        // Update service's rating
        const reviews = await Review.find({ service: serviceId });
        const avgRating = reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;

        service.rating = avgRating;
        await service.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId })
            .populate('reviewer', 'name profilePicture');

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
