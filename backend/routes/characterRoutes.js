// backend/routes/characterRoutes.js
const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, characterController.createCharacter);
router.get('/', authenticateToken, characterController.getCharacters);
router.get('/:id', authenticateToken, characterController.getCharacterById);
router.put('/:id', authenticateToken, characterController.updateCharacter);
router.delete('/:id', authenticateToken, characterController.deleteCharacter);

module.exports = router;