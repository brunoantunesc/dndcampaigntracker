// backend/controllers/calendarController.js
const Calendar = require('../models/Calendar');

exports.createCalendar = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: 'O campo name é obrigatório.' });
    }
    const calendar = new Calendar(req.body);
    await calendar.save();
    res.status(201).json(calendar);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar calendário', error });
  }
};

exports.getCalendars = async (req, res) => {
  try {
    const calendars = await Calendar.find().populate('months');
    res.json(calendars);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar calendários', error });
  }
};


exports.updateCalendar = async (req, res) => {
  try {
    const updated = await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Calendário não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar calendário', error: err.message });
  }
};

exports.deleteCalendar = async (req, res) => {
  try {
    const deleted = await Calendar.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Calendário não encontrado' });
    res.json({ message: 'Calendário deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao deletar calendário', error: err.message });
  }
};