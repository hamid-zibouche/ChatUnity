const passport = require('passport');
const Serveur = require('../models/serveur');

const isAdminServeur = async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, existingUser) => {
    try {
      const serveurId = req.params.serveurId;
      console.log(serveurId)
      const serveur = await Serveur.findByPk(serveurId);

      if (serveur) {
        console.log('utilisateurId:', existingUser.id);
        if (existingUser && existingUser.id === serveur.idCreateur) {
          return next();
        }
        res.status(401).json({ message: 'Accès refusé. Vous devez être administrateur.' });
      } else {
        res.status(401).json({ message: 'Serveur introuvable.' });
      }
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  })(req, res, next);
};

module.exports = { isAdminServeur };
