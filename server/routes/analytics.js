const express = require('express');
const authenticate = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();
router.use(authenticate);

router.get('/summary', analyticsController.summary);
router.get('/monthly', analyticsController.monthly);
router.get('/categories', analyticsController.categories);

module.exports = router;
