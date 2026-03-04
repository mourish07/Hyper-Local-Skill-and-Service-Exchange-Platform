const Service = require('../models/Service');

// @desc    Create a service
// @route   POST /api/services
// @access  Private (Volunteer/Admin)
exports.createService = async (req, res) => {
    try {
        const { title, description, category, points, location, images, allowSkillSwap } = req.body;

        const service = await Service.create({
            provider: req.user.id,
            title,
            description,
            category,
            points,
            location,
            images,
            allowSkillSwap: allowSkillSwap === true || allowSkillSwap === 'true'
        });

        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
    try {
        const { category, location, keyword, provider } = req.query;
        let query = { isActive: true };

        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (provider) query.provider = provider;
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        const services = await Service.find(query).populate('provider', 'name email profilePicture rating');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('provider', 'name email profilePicture rating');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Provider/Admin)
exports.updateService = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check if user is provider or admin
        if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Filter body to allow specific fields if needed, but for now we allow req.body
        // ensuring allowSkillSwap is a boolean if present
        if (req.body.allowSkillSwap !== undefined) {
            req.body.allowSkillSwap = req.body.allowSkillSwap === true || req.body.allowSkillSwap === 'true';
        }

        service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Provider/Admin)
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check if user is provider or admin
        if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await service.remove();
        res.json({ message: 'Service removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
