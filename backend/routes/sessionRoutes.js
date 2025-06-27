// backend/routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/', sessionController.createSession);
router.get('/', sessionController.getSessions);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

module.exports = router;