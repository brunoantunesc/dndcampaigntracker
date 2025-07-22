// backend/controllers/sessionController.js
const Session = require('../models/Session');

exports.createSession = async (req, res) => {
  try {
    const session = await Session.create({...req.body, owner: req.user.id});
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar sessão', error: err.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate('campaign');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar sessões', error: err.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('campaign')  // popula o objeto Campaign relacionado
      .populate('owner');    // popula o objeto User relacionado

    if (!session) {
      return res.status(404).json({ message: 'Sessão não encontrada' });
    }
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao buscar sessão', error: err.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Sessão não encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar sessão', error: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const deleted = await Session.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Sessão não encontrada' });
    res.json({ message: 'Sessão deletada com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao deletar sessão', error: err.message });
  }
};
