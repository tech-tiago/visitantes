const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Mensagens
router.get('/messages', authMiddleware, messageController.getReceivedMessages);
router.get('/sent', authMiddleware, messageController.getSentMessages);
router.get('/archived', authMiddleware, messageController.getArchivedMessages);
router.get('/deleted', authMiddleware, messageController.getDeletedMessages);

router.post('/messages', authMiddleware, messageController.createMessage);
router.post('/:id/read', authMiddleware, messageController.markMessageAsRead);
router.post('/:id/delete', authMiddleware, messageController.deleteMessage);
router.post('/:id/archive', authMiddleware, messageController.archiveMessage);

module.exports = router;
