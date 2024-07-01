const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// Rota para registrar um novo usuário
router.post('/register', authController.register);

// Rota para fazer login
router.post('/login', authController.login);

// Rota para obter informações do usuário logado
router.get('/user', authenticateToken, authController.getUserInfo);

// Rota para atualizar informações do usuário logado
router.post('/update', authenticateToken, authController.updateUser);

module.exports = router;
