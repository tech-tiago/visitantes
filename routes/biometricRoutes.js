// routes/biometricRoutes.js
const express = require('express');
const router = express.Router();
const { startBiometricRegistration } = require('../controllers/biometricController');

router.post('/start-biometric-registration', startBiometricRegistration);

module.exports = router;
