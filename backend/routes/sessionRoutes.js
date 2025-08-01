const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, sessionController.createSession);
router.get('/', authenticateToken, sessionController.getSessions);
router.get('/:id', authenticateToken, sessionController.getSessionById);
router.put('/:id', authenticateToken, sessionController.updateSession);
router.delete('/:id', authenticateToken, sessionController.deleteSession);

module.exports = router;
