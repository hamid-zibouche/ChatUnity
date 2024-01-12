const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const MessagesPrv = require("../models/messagePrv")
const passport = require('passport')
const Sequelize = require('sequelize')
const moment = require('moment')

require('dotenv').config();

const verifieJWT = passport.authenticate('jwt',{session:false},)

// pour pouvoir envoie un message a un utilisateur specifique
router.post('/send/messagesprv/:idUser2',verifieJWT,async (req, res) => {
      const idUser1 = req.user.id; 
      const idUser2 = req.params.idUser2;
      let contenu = req.body.contenu;
      const img = req.files ? req.files.image : null
      const image = img ? img.data : null
  
      if (!contenu && !image) {
        return res.status(400).json({ error: 'Au moins le contenu ou l\'image doit être fourni.' });
      }
      if(contenu && contenu.length < 1 && !image ){
        return res.status(400).json({ error: 'le message doit contenir au moins un caractere' });
      }
      if ((!contenu || contenu.trim().length === 0) && !image) {
        return res.status(400).json({ error: 'Le message doit contenir au moins un caractère non vide.' });
      }

      contenu = contenu.trim()
      try {
        // 1. Enregistrez le nouveau message dans la base de données
        const newMessage = await MessagesPrv.create({
          idUser1,
          idUser2,
          contenu,
          image,
        });
        console.log(newMessage)
        // 2. Récupérez tous les messages entre les deux utilisateurs après l'ajout du nouveau message.
        const messages = await MessagesPrv.findAll({
          where: {
            [Sequelize.Op.or]: [
              { idUser1, idUser2 },
              { idUser1: idUser2, idUser2: idUser1 },
            ],
          },
          order: [['date', 'ASC']], // Ordre chronologique
        });
        
        // 3. Renvoyez la liste mise à jour des messages au client.
        res.status(200).send(newMessage);
      } catch (error) {
        console.error('Erreur :', error);
        res.status(500).send('Erreur serveur');
      }
    }
  );

  // avoir tout les messages echangé avec un utilisateur specifique
  router.get('/chat/messagesprv/:idUser2',verifieJWT,async (req, res)=>{
    const idUser1 = req.user.id;
    const idUser2 = req.params.idUser2;

    const messages = await MessagesPrv.findAll({
      where: {
        [Sequelize.Op.or]: [
          { idUser1, idUser2 },
          { idUser1: idUser2, idUser2: idUser1 },
        ],
      },
      order: [['date', 'ASC']], // Ordre chronologique
    });


    // 3. Renvoyez la liste mise à jour des messages au client.
    res.json(messages);
  })

  // pour avoir tout les chats de l'utilisateurs
  router.get('/chats', verifieJWT, async (req, res) => {
    const idUser = req.user.id;

    const messages = await MessagesPrv.findAll({
      attributes: [
          [
              Sequelize.literal(`LEAST(idUser1, idUser2)`),
              'idUser1',
          ],
          [
              Sequelize.literal(`GREATEST(idUser1, idUser2)`),
              'idUser2',
          ],
          [
              Sequelize.fn('MAX', Sequelize.col('date')),
              'date',
          ],
          [
              Sequelize.literal(`
                  (SELECT contenu
                  FROM messages_prvs AS m
                  WHERE
                      (
                          (m.idUser1 = LEAST(messages_prvs.idUser1, messages_prvs.idUser2) AND m.idUser2 = GREATEST(messages_prvs.idUser1, messages_prvs.idUser2))
                          OR (m.idUser1 = GREATEST(messages_prvs.idUser1, messages_prvs.idUser2) AND m.idUser2 = LEAST(messages_prvs.idUser1, messages_prvs.idUser2))
                      )
                      AND m.date = MAX(messages_prvs.date)
                      AND (m.idUser1 = ${idUser} OR m.idUser2 = ${idUser})
                  LIMIT 1)
              `),
              'contenu',
          ],
      ],
      where: {
          [Sequelize.Op.or]: [
              { idUser1: idUser },
              { idUser2: idUser }
          ],
      },
      group: [
          [Sequelize.literal(`LEAST(idUser1, idUser2)`)],
          [Sequelize.literal(`GREATEST(idUser1, idUser2)`)],
      ],
      order: [['date', 'DESC']],
      raw: true,
  });

    res.json(messages);
});


//pour trouvé les users avec les quels on a echangé des messages 
  router.get('/chats/findUser/',verifieJWT,async (req, res)=>{
    const idUser = req.user.id;
    const messages = await MessagesPrv.findAll({
      where: {
        [Sequelize.Op.or]: [
          { idUser1:idUser},
          { idUser2:idUser}
        ],
      },
      order: [['date', 'ASC']], // Ordre chronologique
    });

    // 3. Renvoyez la liste mise à jour des messages au client.
    res.json(messages);
  })



  module.exports = router;