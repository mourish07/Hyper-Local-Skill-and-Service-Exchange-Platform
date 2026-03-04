const express = require('express');
const router = express.Router();
const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
} = require('../controllers/service.controller');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getServices)
    .post(protect, authorize('volunteer', 'admin'), createService);

router.route('/:id')
    .get(getServiceById)
    .put(protect, updateService)
    .delete(protect, deleteService);

module.exports = router;
