const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

router.get('/calculate', billingController.calculateBills);
router.get('/outstanding', billingController.getOutstandingBills);

module.exports = router;