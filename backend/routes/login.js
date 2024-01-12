const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const passport = require('passport')

require('dotenv').config();


// login
router.post('/login',async(req,res)=>{
    passport.authenticate('local', { session: false },(err, existingUser) => {
      console.log(existingUser)
        if(!existingUser){
          res.status(400).send('erreur:password or username incorrecte')
        }
        else{
          const token = jwt.sign({ 
                id:existingUser.id,
                nom:existingUser.nom,
                prenom:existingUser.prenom,
                username: existingUser.pseudo,
                email: existingUser.email,
                password:existingUser.password,
                role:existingUser.role
           }, process.env.code );
          console.log(token)

          const userInfo = {
            id:existingUser.id,
            nom:existingUser.nom,
            prenom:existingUser.prenom,
            username: existingUser.pseudo,
            email:existingUser.email,
            role:existingUser.role,
            token
          }
         
          // res.redirect('/profile')
          res.status(200).send(userInfo)
        }
    })(req,res);
  })
  
  //la page accueil du site pour l'instant c'est un simple formulaire en ejs
   router.get('/',(req,res)=>{
    res.render('login');
   })
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

    // Enregistrez les informations de l'utilisateur dans le localStorage
    const userInformation = {
      id: req.user.id,
      nom: req.user.nom,
      prenom: req.user.prenom,
      email: req.user.email,
      mdp: req.user.mdp
    };

    // Convertissez l'objet en chaîne JSON et enregistrez-le dans le localStorage
    localStorage.setItem('userInformation', JSON.stringify(userInformation));
    

    // Rediriger vers le front-end
    res.redirect('http://localhost:5173');
  }
);


  //la page accueil du site pour l'instant c'est un simple formulaire en ejs
 router.get('/',(req,res)=>{
    res.render('login');
   })

  module.exports = router;