const Message = require('../models/Message');
const { Op } = require('sequelize');

// Obtenir tous les messages d'un canal textuel
exports.getMessagesByChanel = async (req, res) => {
  try {
    const chanelId = req.params.chanelId;
    const messages = await Message.findAll({ where: { idChanel: chanelId } });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un nouveau message dans un canal textuel
exports.createMessage = async (req, res) => {
  const { chanelId } = req.params;
  const { userId, contenu, image } = req.body;

  try {
    const newMessage = await Message.create({
      idChanel: chanelId,
      idUser: userId,
      contenu: contenu,
      image: image
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};