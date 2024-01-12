const express =  require('express')
const router = express.Router()
const UserModel = require('../models/utilisateurs')
const {isAdmin} = require('../middlewares/authAdmin')
const BanAdmin = require('../models/BanAdmin')
const passport = require('passport')

const verifieJWT = passport.authenticate('jwt',{session:false},)

router.post('/users/bannir', verifieJWT ,isAdmin, async (req, res) => {
    try {

      const user = await UserModel.findByPk(req.body.id);
      console.log(req.body.id);
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      const userBan = await BanAdmin.findOne({ where: { idbanni: user.id } });
      if (userBan) {
        return res.status(400).json({ message: 'Utilisateur déjà banni' });
      }
  
      const newBan = await BanAdmin.create({
        idbanni: user.id,
        idadmin: req.user.id, 
        Raison: req.body.Raison,
      });
  
      res.status(200).json({ message: 'Utilisateur banni avec succès', newBan });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  router.delete('/users/debannir', verifieJWT ,isAdmin, async (req, res) => {
    try {
      const userId = req.body.id;
  
      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
      }
  
      const ban = await BanAdmin.findOne({ where: { idbanni: userId } });
      if (!ban) {
        return res.status(402).json({ message: 'Utilisateur non banni' });
      }
  
      await ban.destroy();
  
      res.status(200).json({ message: 'Utilisateur débanni avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  module.exports = router;
  
  