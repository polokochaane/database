const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getAllCustomers);
router.get('/profile', customerController.getProfile);
router.post('/', customerController.addCustomer);

module.exports = router;