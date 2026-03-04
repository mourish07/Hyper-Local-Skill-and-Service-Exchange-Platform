const express = require('express');
const router = express.Router();
const { getUsers, getStats, deleteUser } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);

module.exports = router;
