const express =  require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const passport = require('passport')

require('dotenv').config();

// Route pour initier le processus d'authentification avec Google
router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Callback après l'authentification avec Google
router.get('/login/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/failed' }),
  (req, res) => {
    // Créer un token JWT avec les données de l'utilisateur authentifié
    const token = jwt.sign({
      id: req.user.id,
      nom: req.user.nom,
      prenom: req.user.prenom,
      email: req.user.email
    }, process.env.code);

    // Renvoyer le token au Utilisateur dans la réponse JSON
    res.json({ 'accessToken': 'Bearer ' + token });
  }
);

router.get('/failed',(req,res)=>{
    res.send('You are not a valide google User')
  })

module.exports= router;