// backend/controllers/worldController.js
const World = require('../models/World');

exports.createWorld = async (req, res) => {
  try {
    const world = new World({ ...req.body, owner: req.user.id });
    await world.save();
    res.status(201).json(world);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar mundo', error });
  }
};

exports.getWorlds = async (req, res) => {
  try {
    const worlds = await World.find({ owner: req.user.id }).select('name description calendar').populate('calendar');
    res.json(worlds);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar mundos', error });
  }
};

exports.getWorldById = async (req, res) => {
  try {
    const world = await World.findById(req.params.id).populate('calendar');
    res.json(world);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar mundos', error });
  }
};

exports.updateWorld = async (req, res) => {
  try {
    const updated = await World.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Mundo não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar mundo', error: err.message });
  }
};

exports.deleteWorld = async (req, res) => {
  try {
    const deleted = await World.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Mundo não encontrado' });
    res.json({ message: 'Mundo deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao deletar mundo', error: err.message });
  }
};

