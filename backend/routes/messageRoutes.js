const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const passport= require('../middlewares/authPassport')

// Middleware pour vérifier l'authentification
const verifieJWT = passport.authenticate('jwt',{session:false},)

// Route pour obtenir tous les messages d'un canal textuel
router.get('/:chanelId', verifieJWT, messageController.getMessagesByChanel);

// Route pour créer un nouveau message dans un canal textuel
router.post('/:chanelId', verifieJWT, messageController.createMessage);

module.exports = router;