const { group } = require('console');
const passport = require('passport')
const Groupe = require('../models/groupe')

const isAdminGroupe = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async(err, existingUser) => {
      try{
        const groupeId = req.params.groupId
        const groupe = await Groupe.findOne({where:{id:groupeId}})
        
        if(groupe)
          {console.log('utilisateurId:',existingUser.id)
          if (existingUser && existingUser.id === groupe.idAdmin) {
            return next();
          }
          res.status(401).json({ message: 'Accès refusé. Vous devez être administrateur.' });
        }else{
          res.status(401).json({ message: 'Group Not Found' });
        }
      }catch(e){
        console.log(e)
        res.send(e)
      }
    })(req, res, next);
  };

module.exports ={isAdminGroupe};
