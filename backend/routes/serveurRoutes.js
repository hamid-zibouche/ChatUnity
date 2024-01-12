const express = require('express');
const router = express.Router();
const { isAdminServeur } = require('../middlewares/authAdminServeur');
const passport = require('passport')

require('dotenv').config();

const verifieJWT = passport.authenticate('jwt',{session:false},)
// Route pour la création d'un serveur
router.post('/serveur/create',verifieJWT, async (req, res) => {
    try {
      // Récupérer les données du corps de la requête
      console.log("------------ ///// ::: ", req.body);
      const { nom } = req.body;
      console.log(req.user.id);
      const idCreateur = req.user.id
      // Créer un nouveau serveur
      const serveur = await Serveur.create({
        nom,
        idCreateur,
      });
  
      // Répondre avec le serveur créé
      res.status(201).json({ serveur });
    } catch (error) {
      // Gérer les erreurs
      console.log(error)
      res.status(500).json({ error: 'Une erreur est survenue lors de la création du serveur.' });
    }
  });

// Route pour la modification d'un serveur
router.put('/serveur/update/:serveurId',isAdminServeur, async (req,  res) => {
  try {
    // Récupérer l'ID du serveur à mettre à jour depuis les paramètres de la requête
    const { serveurId } = req.params;
    console.log(serveurId)

    // Récupérer les nouvelles données du corps de la requête
    const { nom } = req.body;

    // Rechercher le serveur dans la base de données
    const serveur = await Serveur.findByPk(serveurId);

    if (!serveur) {
      return res.status(404).json({ error: 'Serveur non trouvé.' });
    }

    // Mettre à jour les propriétés du serveur
    serveur.nom = nom.trim();

    // Sauvegarder les modifications dans la base de données
    await serveur.save();

    // Répondre avec le serveur mis à jour
    res.json({ serveur });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du serveur.' });
  }
});
const Serveur = require('../models/serveur');

// Supprimer un serveur
router.delete('/serveur/delete/:serveurId', isAdminServeur, async (req, res) => {
  try {
    const serveurId = req.params.serveurId;

    // Vérifier si le serveur existe
    const serveur = await Serveur.findByPk(serveurId);
    if (!serveur) {
      return res.status(404).json({ message: 'Serveur introuvable.' });
    }

    // Supprimer le serveur
    await serveur.destroy();

    res.json({ message: 'Serveur supprimé avec succès.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du serveur.' });
  }
});

module.exports = router;