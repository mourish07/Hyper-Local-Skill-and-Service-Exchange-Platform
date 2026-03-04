const User = require('../models/User');
const Service = require('../models/Service');
const Request = require('../models/Request');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const serviceCount = await Service.countDocuments();
        const requestCount = await Request.countDocuments();
        const pendingRequests = await Request.countDocuments({ status: 'pending' });
        const completedTasks = await Request.countDocuments({ status: 'completed' });

        // Calculate total coins in circulation
        const totalCoinsData = await User.aggregate([
            { $group: { _id: null, total: { $sum: "$balance" } } }
        ]);
        const totalCoins = totalCoinsData.length > 0 ? totalCoinsData[0].total : 0;

        res.json({
            userCount,
            serviceCount,
            requestCount,
            pendingRequests,
            completedTasks,
            totalCoins
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
