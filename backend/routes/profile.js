const express =  require('express')
const router = express.Router()
const passport = require('passport')
const UserModel = require('../models/utilisateurs');
const Utilisateurs = require('../models/utilisateurs');
const { Op,Sequelize } = require('sequelize');

require('dotenv').config();

const verifieJWT = passport.authenticate('jwt',{session:false},)

//Renvoi les informations du profil utilisateur 
router.get('/users/profil', verifieJWT, (req, res) => {
  try {
    const userModel = {
      id: req.user.id,
      nom: req.user.nom,
      prenom: req.user.prenom,
      username: req.user.pseudo,
      email: req.user.email,
      image: req.user.image,
    };

    res.status(200).send(userModel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

//Modifie les informations du user tout en verifiant que la personne possède les droits
router.put('/users/profil', verifieJWT, async (req, res) => {
  try {
    const userToUpdate = await UserModel.findByPk(req.user.id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (req.user.id !== userToUpdate.id) {
      return res.status(403).json({ message: 'Tu nes pas authorisé à modifier ces informations là ' });
    }

    userToUpdate.nom = req.body.nom.trim() || userToUpdate.nom;
    userToUpdate.prenom = req.body.prenom.trim() || userToUpdate.prenom;
    userToUpdate.username = req.body.pseudo.trim() || userToUpdate.pseudo;
    userToUpdate.email = req.body.email.trim() || userToUpdate.email;
    userToUpdate.image = req.body.image.trim() || userToUpdate.image;

    await userToUpdate.save();
//à modifier appeler la fonction au dessus pour donnée les info sur le profil apres modif 
    res.status(200).json({
      id: userToUpdate.id,
      nom: userToUpdate.nom,
      prenom: userToUpdate.prenom,
      username: userToUpdate.pseudo,
      email: userToUpdate.email,
      image: userToUpdate.image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error' });
  }
});

router.get('/users/find/:userId',  async (req, res) => {
  try {

    const userId = req.params.userId;

    const user = await UserModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Construire le modèle utilisateur à renvoyer en réponse
    const userModel = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      username: user.pseudo,
      email: user.email,
      image: user.image,
    };

    res.status(200).json(userModel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/users/findByPseudo/:pseudo',  async (req, res) => {
  try {

    const pseudo = req.params.pseudo

    const users = await UserModel.findAll({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('pseudo')),
        'LIKE',
        `%${pseudo.trim().toLowerCase()}%`
      )
    });
    console.log('--------->W',users)

    if (!users) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur serveur', error});
  }
});


module.exports = router;