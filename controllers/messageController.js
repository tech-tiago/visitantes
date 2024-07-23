const Message = require('../models/Message');
const User = require('../models/User');

// Busca todas as mensagens não excluídas
exports.getAllMessages = async (req, res) => {
  try {
    const { type } = req.query;
    let whereClause = { deleted: false };
    
    if (type === 'received') {
      whereClause.recipientId = req.user.id;
    } else if (type === 'sent') {
      whereClause.senderId = req.user.id;
    } else if (type === 'archived') {
      whereClause.recipientId = req.user.id;
      whereClause.archived = true;
    } else if (type === 'deleted') {
      whereClause.recipientId = req.user.id;
      whereClause.deleted = true;
    }
    
    const messages = await Message.findAll({
      where: whereClause,
      include: [{ model: User, as: 'sender' }, { model: User, as: 'recipient' }]
    });

    console.log('Fetched messages:', messages);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens', details: error.message });
  }
};

// Busca uma mensagem pelo ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      include: [{ model: User, as: 'sender' }, { model: User, as: 'recipient' }] // Inclui informações de remetente e destinatário
    });
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ error: 'Mensagem não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagem' });
  }
};

// Cria uma nova mensagem
exports.createMessage = async (req, res) => {
  try {
    const newMessage = await Message.create({
      ...req.body,
      senderId: req.user.id, // Define o ID do usuário logado como remetente
      date: new Date()
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar mensagem' });
  }
};

// Atualiza uma mensagem existente
exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (message) {
      await message.update(req.body);
      res.json(message);
    } else {
      res.status(404).json({ error: 'Mensagem não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar mensagem' });
  }
};

// Move uma mensagem para a lixeira
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (message) {
      await message.update({ deleted: true });
      res.json({ message: 'Mensagem movida para lixeira' });
    } else {
      res.status(404).json({ error: 'Mensagem não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir mensagem' });
  }
};

// Arquiva uma mensagem
exports.archiveMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (message) {
      await message.update({ archived: true });
      res.json({ message: 'Mensagem arquivada' });
    } else {
      res.status(404).json({ error: 'Mensagem não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao arquivar mensagem' });
  }
};

// Busca todas as mensagens recebidas pelo usuário logado
exports.getReceivedMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { recipientId: req.user.id, deleted: false },
      include: [{ model: User, as: 'sender' }]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens recebidas' });
  }
};

// Busca todas as mensagens enviadas pelo usuário logado
exports.getSentMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { senderId: req.user.id, deleted: false },
      include: [{ model: User, as: 'recipient' }]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens enviadas' });
  }
};

// Busca todas as mensagens arquivadas pelo usuário logado
exports.getArchivedMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { recipientId: req.user.id, archived: true, deleted: false },
      include: [{ model: User, as: 'sender' }]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens arquivadas' });
  }
};

// Busca todas as mensagens excluídas pelo usuário logado
exports.getDeletedMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { recipientId: req.user.id, deleted: true },
      include: [{ model: User, as: 'sender' }]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens excluídas' });
  }
};

// Marca uma mensagem como lida
exports.markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (message && message.recipientId === req.user.id) {
      message.read = true;
      await message.save();
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao marcar mensagem como lida' });
  }
};


