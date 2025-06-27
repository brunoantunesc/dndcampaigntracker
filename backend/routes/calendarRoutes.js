const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, calendarController.createCalendar);
router.get('/', authenticateToken, calendarController.getCalendars);
router.put('/:id', authenticateToken, calendarController.updateCalendar);
router.delete('/:id', authenticateToken, calendarController.deleteCalendar);

module.exports = router;