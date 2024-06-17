const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/', authenticateToken, visitorController.createVisitor);
router.get('/open', authenticateToken, visitorController.getOpenVisits);
router.put('/close/:id', authenticateToken, visitorController.closeVisit);
router.get('/closed', authenticateToken, visitorController.getClosedVisits);
router.get('/:id', authenticateToken, visitorController.getVisitor);
router.get('/photo/:id', authenticateToken, visitorController.getVisitorPhoto);

module.exports = router;