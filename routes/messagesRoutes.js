const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

router.get('/', authMiddleware, messageController.getAllMessages);
router.get('/:id', authMiddleware, messageController.getMessageById);
router.post('/', authMiddleware, messageController.createMessage);
router.put('/:id', authMiddleware, messageController.updateMessage);
router.delete('/:id', authMiddleware, messageController.deleteMessage);
router.put('/:id/archive', authMiddleware, messageController.archiveMessage);
router.put('/:id/read', authMiddleware, messageController.markMessageAsRead);
router.get('/received', authMiddleware, messageController.getReceivedMessages);
router.get('/sent', authMiddleware, messageController.getSentMessages);
router.get('/archived', authMiddleware, messageController.getArchivedMessages);
router.get('/deleted', authMiddleware, messageController.getDeletedMessages);

module.exports = router;
