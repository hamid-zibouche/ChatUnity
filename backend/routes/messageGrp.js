const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const MessagesGroupe = require("../models/messageGrp");
const passport = require('passport');
const Sequelize = require('sequelize');

require('dotenv').config();

const verifieJWT = passport.authenticate('jwt', { session: false });

router.post('/send/messagesGrp/:groupId', verifieJWT, async (req, res) => {
  const userId = req.user.id;
  const groupId = req.params.groupId;
  let contenu = req.body.contenu;
  const img = req.files ? req.files.image : null;
  const image = img ? img.data : null;

  if (!contenu && !image) {
    return res.status(400).json({ error: 'Au moins le contenu ou l\'image doit être fourni.' });
  }
  if (contenu && contenu.length < 1 && !image) {
    return res.status(400).json({ error: 'le message doit contenir au moins un caractère' });
  }
  if ((!contenu || contenu.trim().length === 0) && !image) {
    return res.status(400).json({ error: 'Le message doit contenir au moins un caractère non vide.' });
  }

  contenu = contenu.trim();
  try {
    // 1. Enregistrez le nouveau message dans la base de données
    const Messages = await MessagesGroupe.create({
      idUser: userId,
      idGroupe: groupId,
      contenu,
      image,
      date: new Date(),
    });

    // 3. Renvoyez la liste mise à jour des messages au client.
    res.json(Messages);
  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).send('Erreur serveur');
  }
});

router.get('/messagesGrp/:groupId', verifieJWT, async (req, res) => {
  const userId = req.user.id;
  const groupId = req.params.groupId;


 
  try {

    // 2. Récupérez tous les messages du groupe après l'ajout du nouveau message.
    const messages = await MessagesGroupe.findAll({
      where: { idGroupe: groupId },
      order: [['date', 'ASC']], // Ordre chronologique
    });

    // 3. Renvoyez la liste mise à jour des messages au client.
    res.json(messages);
  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;