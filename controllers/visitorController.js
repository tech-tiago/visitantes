const Visitor = require('../models/Visitor');

exports.createVisitor = async (req, res) => {
  try {
    const { nome, documento, data_entrada, hora_entrada, motivo } = req.body;
    const foto = req.body.foto;
    const visitor = await Visitor.create({ nome, documento, data_entrada, hora_entrada, foto, motivo });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOpenVisits = async (req, res) => {
  try {
    const visitors = await Visitor.findAll({ where: { status: 'aberto' } });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.closeVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { data_saida, hora_saida } = req.body;
    const visitor = await Visitor.findByPk(id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    visitor.data_saida = data_saida;
    visitor.hora_saida = hora_saida;
    visitor.status = 'encerrado';
    await visitor.save();
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClosedVisits = async (req, res) => {
  try {
    const visitors = await Visitor.findAll({ where: { status: 'encerrado' } });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await Visitor.findByPk(id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};