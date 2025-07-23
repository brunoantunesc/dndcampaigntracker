// backend/controllers/characterController.js
const Character = require('../models/Character');

exports.createCharacter = async (req, res) => {
  try {
    const character = await Character.create(req.body);
    res.status(201).json(character);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar personagem', error: err.message });
  }
};

exports.getCharacters = async (req, res) => {
  try {
    const characters = await Character.find().populate('world');
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar personagens', error: err.message });
  }
};
exports.getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate('world');
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.json(character);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching character', error: err.message });
  }
};

exports.updateCharacter = async (req, res) => {
  try {
    const updated = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Personagem não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar personagem', error: err.message });
  }
};

exports.deleteCharacter = async (req, res) => {
  try {
    const deleted = await Character.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Personagem não encontrado' });
    res.json({ message: 'Personagem deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao deletar personagem', error: err.message });
  }
};