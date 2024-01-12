const express =  require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const passport = require('passport')

require('dotenv').config();


// Route pour initier le processus d'authentification avec Facebook
router.get('/login/facebook', passport.authenticate('facebook'));

// Callback après l'authentification avec Facebook
router.get('/login/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/failed' }),
  (req, res) => {
    // Créer un token JWT avec les données de l'utilisateur authentifié
    const token = jwt.sign({
      id: req.user.id,
      nom: req.user.nom,
      prenom: req.user.prenom,
      email: req.user.email,
      mdp: req.user.mdp
    }, process.env.code);

    // Renvoyer le token au Utilisateur dans la réponse JSON
    res.json({ 'accessToken': 'Bearer ' + token });
  }
);

router.get('/failed',(req,res)=>{
    res.send('You are not a facebook valide User')
  })

module.exports = router;