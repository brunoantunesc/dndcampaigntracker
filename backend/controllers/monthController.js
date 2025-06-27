const Month = require('../models/Month');

exports.createMonth = async (req, res) => {
  try {
    const month = new Month(req.body);
    await month.save();
    res.status(201).json(month);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar mês', error });
  }
};

exports.getMonths = async (req, res) => {
  try {
    const months = await Month.find();
    res.json(months);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar meses', error });
  }
};

exports.updateMonth = async (req, res) => {
  try {
    const updated = await Month.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Mês não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar mês', error: err.message });
  }
};

exports.deleteMonth = async (req, res) => {
  try {
    const deleted = await Month.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Mês não encontrado' });
    res.json({ message: 'Mês deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao deletar mês', error: err.message });
  }
};