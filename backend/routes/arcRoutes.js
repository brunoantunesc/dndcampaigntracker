const express = require('express');
const router = express.Router();
const arcController = require('../controllers/arcController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, arcController.createArc);
router.get('/', authenticateToken, arcController.getArcs);
router.get('/:id', authenticateToken, arcController.getArcById);
router.put('/:id', authenticateToken, arcController.updateArc);
router.delete('/:id', authenticateToken, arcController.deleteArc);

module.exports = router;
