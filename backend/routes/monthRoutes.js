const express = require('express');
const router = express.Router();
const monthController = require('../controllers/monthController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, monthController.createMonth);
router.get('/', authenticateToken, monthController.getMonths);
router.put('/:id', authenticateToken, monthController.updateMonth);
router.delete('/:id', authenticateToken, monthController.deleteMonth);

module.exports = router;