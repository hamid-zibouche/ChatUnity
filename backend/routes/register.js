const express =  require('express')
const router = express.Router()

const Utilisateurs = require('../models/utilisateurs')

require('dotenv').config();
const bcrypt = require("bcrypt")

// register
router.post('/register',async (req, res) => {
    try {
      const { nom, prenom, pseudo, email, mdp } = req.body;
  
      // Vérifications des champs obligatoires
      if (!nom || !prenom || !pseudo || !email || !mdp) {
        return res.status(400).send('Les champs nom, prenom, pseudo, email et mdp sont obligatoires.');
      }
  
      // Vérification de la longueur du mot de passe
      if (mdp.length < 8) {
        return res.status(400).send('Le mot de passe doit contenir au moins 8 caractères.');
      }
  
      // Vérification de l'unicité du pseudo
      const existingUser = await Utilisateurs.findOne({
        where: { pseudo: pseudo }
      });
  
      if (existingUser) {
        return res.status(400).send('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
      }
  
      // Hachage du mot de passe
      const hashMdp = await bcrypt.hash(mdp, 10);
  
      // Accédez aux données binaires de l'image depuis req.file.buffer
      const image = req.files ? req.files.image : null
      const imageBlob = image ? image.data : "null"
      console.log(imageBlob)
      
      console.log(req.files)
      // Création de l'utilisateur
      await Utilisateurs.create({
        nom: nom,
        prenom: prenom,
        pseudo: pseudo,
        email: email,
        mdp: hashMdp,
        image: imageBlob
      });
  
      res.status(200).send('Enregistrement réussi');
    } catch (error) {
      console.error('Erreur :', error);
      res.status(500).send('Erreur serveur');
    }
  });

  module.exports = router;
  