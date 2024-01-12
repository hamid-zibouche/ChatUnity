const express = require('express');
const router = express.Router();
const Serveur = require('../models/serveur');
const CanalTextuel = require('../models/canalTextuel');
const { isAdminServeur } = require('../middlewares/authAdminServeur');
const passport = require('passport')
const messageServeur= require('./messageRoutes')
const verifieJWT = passport.authenticate('jwt',{session:false},)

router.use('/serveur/:serveurId/chanel',verifieJWT,messageServeur)
// Créer un nouveau canal
router.post('/serveur/:serveurId/cretaeCanal', isAdminServeur, async (req, res) => {
  try {
    const idServer = req.params.serveurId;
   
    // Vérifier si le serveur existe
    const serveur = await Serveur.findByPk(idServer);
    if (!serveur) {
      return res.status(404).json({ message: 'Serveur introuvable.' });
    }

    // Créer le canal
    let { nom } = req.body;
    console.log(nom)
    console.log(serveur)
    if (nom && nom.trim().length==0){
      return res.json({"erreur":'le nom est vide'})
    }
    nom = nom.trim()
    const canal = await CanalTextuel.create({
      nom,
      idServer
    });

    res.json({ message: 'Canal créé avec succès.', canal });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la création du canal.' });
  }
});

// Modifier un canal
router.put('/serveur/:serveurId/canaux/:canalId', isAdminServeur, async (req, res) => {
  try {
    const idServer = req.params.serveurId;
    const id = req.params.canalId;
  

    // Vérifier si le serveur existe
    const serveur = await Serveur.findByPk(idServer);
    if (!serveur) {
      return res.status(404).json({ message: 'Serveur introuvable.' });
    }

    // Vérifier si le canal existe
    const canal = await CanalTextuel.findByPk(id);
    if (!canal) {
      return res.status(404).json({ message: 'Canal introuvable.' });
    }

    // Modifier les propriétés du canal
    const { nom } = req.body;
    canal.nom = nom.trim();
    await canal.save();

    res.json({ message: 'Canal modifié avec succès.', canal });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la modification du canal.' });
  }
});

// Supprimer un canal
router.delete('/serveur/:serveurId/canaux/:canalId', isAdminServeur, async (req, res) => {
  try {
    const idServer = req.params.serveurId;
    const id = req.params.canalId;

    // Vérifier si le serveur existe
    const serveur = await Serveur.findByPk(idServer);
    if (!serveur) {
      return res.status(404).json({ message: 'Serveur introuvable.' });
    }

    // Vérifier si le canal existe
    const canal = await CanalTextuel.findByPk(id);
    if (!canal) {
      return res.status(404).json({ message: 'Canal introuvable.' });
    }

    // Supprimer le canal
    await canal.destroy();

    res.json({ message: 'Canal supprimé avec succès.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du canal.' });
  }
});
module.exports = router;
