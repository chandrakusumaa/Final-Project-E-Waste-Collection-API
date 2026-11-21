const express = require('express');
const router = express.Router();
const { loginSimulation } = require('../controllers/authController');

// POST /api/auth/login - Simulasi Login
router.post('/login', loginSimulation);

module.exports = router;
