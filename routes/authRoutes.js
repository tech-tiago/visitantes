const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');


// Rotas de autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authenticateToken, authController.getUserInfo);
router.put('/update', authenticateToken, authController.updateUser); // Certifique-se de que esta linha está correta

// Rota para obter a lista de usuários
router.get('/users', authenticateToken, authController.getUsers);

module.exports = router;
