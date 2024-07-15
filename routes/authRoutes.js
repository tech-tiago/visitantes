const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/verifyAdmin');


router.post('/register', authenticateToken, isAdmin, authController.register);
router.post('/login', authController.login);
router.get('/user', authenticateToken, authController.getUserInfo);
router.put('/update', authenticateToken, isAdmin, authController.updateUser);
router.put('/update-profile', authenticateToken, authController.updateUserLog); 
router.get('/users', authenticateToken, isAdmin, authController.getUsers);

module.exports = router;
