const { group } = require('console');
const passport = require('passport')
const Groupe = require('../models/membresGroupe')
const isAdminGroupe = async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, existingUser) => {
    try {
      const groupeId = req.params.groupId;
      const groupe = await Groupe.findOne({ where: { id: groupeId } });

      if (groupe) {
        if (existingUser && existingUser.id === groupe.idAdmin) {
          req.group = groupe; // Ajouter le groupe à l'objet req pour une utilisation ultérieure dans la route
          return next();
        }
        res.status(401).json({ message: "Accès refusé. Vous devez être administrateur." });
      } else {
        res.status(404).json({ message: 'Groupe non trouvé.' });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send(e);
    }
  })(req, res, next);
};
module.exports ={isAdminGroupe};