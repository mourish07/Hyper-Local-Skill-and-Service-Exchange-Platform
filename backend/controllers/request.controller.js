const Request = require('../models/Request');
const Service = require('../models/Service');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Create a service request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
    try {
        const { serviceId, message, mode = 'coins' } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        if (service.provider.toString() === req.user.id) {
            return res.status(400).json({ message: 'Cannot request your own service' });
        }

        // Requests are now FREE to send. No balance check here.

        const request = await Request.create({
            requester: req.user.id,
            service: serviceId,
            volunteer: service.provider,
            message,
            mode
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user or volunteer requests
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};

        if (role === 'volunteer') {
            query.volunteer = req.user.id;
        } else {
            query.requester = req.user.id;
        }

        const requests = await Request.find(query)
            .populate('requester', 'name email')
            .populate('volunteer', 'name email')
            .populate('service')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update request status / confirmation
// @route   PUT /api/requests/:id/status
// @access  Private
exports.updateRequestStatus = async (req, res) => {
    try {
        const { status, rating, comment } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const isVolunteer = request.volunteer.toString() === req.user.id;
        const isRequester = request.requester.toString() === req.user.id;

        if (!isVolunteer && !isRequester) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Handle specific status updates (accepted/rejected/cancelled)
        if (['accepted', 'rejected', 'cancelled'].includes(status)) {
            request.status = status;
        }

        // Handle completion with mutual confirmation
        if (status === 'completed') {
            if (isVolunteer) request.volunteerConfirmed = true;
            if (isRequester) request.userConfirmed = true;

            // If both confirmed, finalize the transaction
            if (request.volunteerConfirmed && request.userConfirmed && request.status !== 'completed') {
                const service = await Service.findById(request.service);
                const requester = await User.findById(request.requester);
                const volunteer = await User.findById(request.volunteer);

                if (request.mode === 'coins' && service.points > 0) {
                    const points = Number(service.points);

                    // Award points to Volunteer (rewarding help)
                    // Note: User prompt says "Add reward coins to user wallet" 
                    // and also "Users need coins to send request". 
                    // Usually, requester SPENDS and volunteer EARNS.
                    // But user specifically said: "Add reward coins to user wallet".
                    // Maybe it's a platform incentive? Let's follow prompt exactly:
                    // "When volunteer marks task complete and user confirms: Add reward coins to user wallet."
                    // I will reward BOTH for building community, or as specified.
                    // User prompt wording: "Add reward coins to user wallet."
                    // I'll add to user as requested, and maybe volunteer too if it's a 'reward'.

                    requester.balance += points;
                    // We could also subtract from someone if needed, but per instruction "Add reward coins to user wallet"

                    await requester.save();

                    await Transaction.create({
                        receiver: requester._id,
                        amount: points,
                        type: 'reward',
                        description: `Reward for ${service.title}`
                    });
                }

                // Award XP for gamification
                volunteer.xp += 50;
                requester.xp += 20;

                // Award Badges
                if (!volunteer.badges.includes('Pioneer')) {
                    volunteer.badges.push('Pioneer');
                }
                if (!requester.badges.includes('Pioneer')) {
                    requester.badges.push('Pioneer');
                }

                // Simple level logic (can be refined in utils)
                volunteer.level = Math.floor(volunteer.xp / 100) + 1;
                requester.level = Math.floor(requester.xp / 100) + 1;

                await volunteer.save();
                await requester.save();

                request.status = 'completed';
            }
        }

        await request.save();
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get transaction history
// @route   GET /api/requests/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
