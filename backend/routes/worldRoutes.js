// backend/routes/worldRoutes.js
const express = require('express');
const router = express.Router();
const worldController = require('../controllers/worldController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, worldController.createWorld);
router.get('/', authenticateToken, worldController.getWorlds);
router.put('/:id', authenticateToken, worldController.updateWorld);
router.delete('/:id', authenticateToken, worldController.deleteWorld);

module.exports = router;