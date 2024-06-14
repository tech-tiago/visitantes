const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAdmin } = require('../middleware/authMiddleware');

// Rota para registrar um novo usuário
router.post('/register', isAdmin, authController.register);

// Rota para fazer login
router.post('/login', authController.login);

module.exports = router;
