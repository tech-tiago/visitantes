const path = require('path');
const fs = require('fs');
const saveImage = require('../utils/saveImage');
const Visitor = require('../models/Visitor');
const { Op } = require('sequelize');

exports.updateVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, documento, data_entrada, hora_entrada, motivo, data_saida, hora_saida } = req.body;

        const visitor = await Visitor.findByPk(id);
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        visitor.nome = nome;
        visitor.documento = documento;
        visitor.data_entrada = data_entrada;
        visitor.hora_entrada = hora_entrada;
        visitor.motivo = motivo;
        visitor.data_saida = data_saida;
        visitor.hora_saida = hora_saida;

        await visitor.save();

        res.status(200).json(visitor);
    } catch (error) {
        console.error('Erro ao atualizar visitante:', error);
        res.status(500).json({ message: 'Erro ao atualizar visitante', error: error.message });
    }
};


exports.deleteVisitor = async (req, res) => {
  try {
      const { id } = req.params;
      const visitor = await Visitor.findByPk(id);
      if (!visitor) {
          return res.status(404).json({ message: 'Visitor not found' });
      }

      // Deletar a imagem associada
      if (visitor.foto) {
          const filePath = path.join(__dirname, '..', 'uploads', path.basename(visitor.foto));
          fs.unlink(filePath, (err) => {
              if (err) {
                  console.error('Erro ao deletar a imagem:', err);
              }
          });
      }

      await visitor.destroy();

      res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
      console.error('Erro ao deletar visitante:', error);
      res.status(500).json({ message: 'Erro ao deletar visitante', error: error.message });
  }
};


exports.createVisitor = async (req, res) => {
    try {
        const { nome, documento, data_entrada, hora_entrada, motivo, foto } = req.body;

        // Converte a imagem para o caminho do arquivo
        const fotoUrl = saveImage(foto);

        const visitor = await Visitor.create({ 
            nome, 
            documento, 
            data_entrada, 
            hora_entrada, 
            motivo, 
            foto: fotoUrl  // Salva o caminho da imagem no banco de dados
        });

        res.status(201).json(visitor);
    } catch (error) {
        console.error('Erro ao criar visitante:', error);
        res.status(500).json({ message: 'Erro ao criar visitante', error: error.message });
    }
};


exports.getOpenVisits = async (req, res) => {
  try {
    const visitors = await Visitor.findAll({ where: { status: 'aberto' } });
    console.log('Open Visits:', visitors);
    res.status(200).json(visitors);
  } catch (error) {
    console.error('Error fetching open visits:', error);
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

exports.getVisitorPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await Visitor.findByPk(id, {
      attributes: ['foto']
    });
    if (!visitor || !visitor.foto) {
      return res.status(404).json({ message: 'Visitor photo not found' });
    }

    res.set('Content-Type', 'image/png');
    res.send(visitor.foto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVisitorReport = async (req, res) => {
  try {
      const { start, end } = req.query; // Verifica se os parâmetros estão sendo capturados corretamente
      if (!start || !end) {
          return res.status(400).json({ message: 'Datas de início e fim são necessárias' });
      }

      const visitors = await Visitor.findAll({
          where: {
              data_entrada: {
                  [Op.between]: [new Date(start), new Date(end)] // Usa as datas para filtrar os registros
              }
          }
      });

      if (!Array.isArray(visitors)) {
          return res.status(500).json({ message: 'Erro ao processar os dados' });
      }

      res.status(200).json(visitors);
  } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      res.status(500).json({ message: 'Erro ao buscar relatório', error: error.message });
  }
};