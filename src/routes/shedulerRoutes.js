const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/shedulerController');

// Route to get scheduler data
router.get('/scheduler', schedulerController.getSchedulerData);

// Route to save scheduler data
router.post('/scheduler', schedulerController.saveSchedulerData);

module.exports = router;
