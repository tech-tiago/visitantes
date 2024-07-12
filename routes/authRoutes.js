const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// Rotas de autenticação
router.post('/register', authenticateToken, authController.isAdmin, authController.register);
router.post('/login', authController.login);
router.get('/user', authenticateToken, authController.getUserInfo);
router.put('/update', authenticateToken, authController.isAdmin, authController.updateUser);
router.put('/update-profile', authenticateToken, authController.updateUserLog); // Rota para o usuário logado atualizar seu próprio perfil

// Rota para obter a lista de usuários
router.get('/users', authenticateToken, authController.isAdmin, authController.getUsers);

module.exports = router;
