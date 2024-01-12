const LocalStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')
const Utilisateurs = require('../models/utilisateurs')
const axios = require('axios')
require('dotenv').config();
const bcrypt = require('bcrypt')
const {v4:uuidv4} = require('uuid')

passport.use(new LocalStrategy(async(username, password, done) => {
  console.log(username)
    const existingUser = await Utilisateurs.findOne({
      where:{pseudo:`${username}`} });

    if (!existingUser) {
      console.log('username non existe')
      return done(null, false);
    }
      console.log('utilisateur:',existingUser)
      const decodMdp = await bcrypt.compare(password,existingUser.mdp)
    if(!decodMdp){
      console.log('mot de passe incorrecte')
      return done(null, false);
    }
    console.log('la ici success')
        return done(null, existingUser);
    }
  ));


passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.code, // La clé secrète avec laquelle le token a été signé
    },
  async (token, done) => {
    console.log(token)
    try{
      const user = await Utilisateurs.findOne({where:{id:token.id}})
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

const FacebookStrategy = require('passport-facebook');

passport.use(new FacebookStrategy({
  clientID: '260379753669203',
  clientSecret: '34ba5bd9079152efef7cbe25c98eb29d',
  callbackURL: 'http://localhost:3000/login/facebook/callback',
  profileFields:['id','displayName','first_name','gender', 'last_name','picture.type(large)','email']
  },
  async function (accessToken, refreshToken, profile, cb)  {
  
    try {
      const user = await Utilisateurs.findOne({
        where: { id: profile.id }
      });
      if (user) {
        console.log("utilisateur existe dans la bdd chatDB");
        return cb(null, user);
      } else {
        console.log("utilisateur n'existe pas dans la BDD chatDB");

        const imageUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
        const emailValue = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "null";
        const mdpAleatoire = uuidv4()//pour generé un mot de passe aleatoire pour l'utilisateur facebook
        const hashMdp = await bcrypt.hash(mdpAleatoire,10)//pour hashé le mot de passe aleatoire car on a pas besoin de tout facons

        const newUser = await Utilisateurs.create({
          id:profile.id,
          nom:profile.name.familyName,
          prenom:profile.name.givenName,
          pseudo:profile.displayName,
          email:emailValue,
          mdp:hashMdp,
          image:imageUrl,
          type:'utilisateur'
          
        })
        return cb(null, newUser);
      }
    } catch (err) {
      console.error("Erreur lors de la recherche de l'utilisateur :", err);
      return cb(err);
    }
  }
))

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "567066251552-nenl77mee45dpfvh3hotgpm1b3ovtgtb.apps.googleusercontent.com",
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:3000/login/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(`token=${accessToken}`)
    try {
      const user = await Utilisateurs.findOne({
        where: { email: profile.emails[0].value }
      });
      console.log('--------'+profile+'-----')
      if (user) {
        console.log("utilisateur google existe dans la bdd chatDB");
        return cb(null, user);
      } else {
        console.log("utilisateur google n'existe pas dans la BDD chatDB");

        const mdpAleatoire = uuidv4()//pour generé un mot de passe aleatoire pour l'utilisateur facebook
        const hashMdp = await bcrypt.hash(mdpAleatoire,10)//pour hashé le mot de passe aleatoire car on a pas besoin de tout facons

        const newUser = await Utilisateurs.create({
          nom:profile.name.familyName,
          prenom:profile.name.givenName,
          pseudo:profile.displayName,
          email:profile.emails[0].value,
          mdp:hashMdp,
          image:profile.photos[0].value,
          type:'utilisateur'
          
        })
        return cb(null, newUser);
      }
    } catch (err) {
      console.error("Erreur lors de la recherche de l'utilisateur :", err);
      return cb(err);
    }
  }
)); 

// Fonctions de sérialisation et désérialisation de l'utilisateur (vous pourriez les personnaliser en fonction de votre application)
passport.serializeUser((user, done) => {
  console.log('serialize')
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  console.log('deserialize')
  try {
    const user = await Utilisateurs.findOne({where :{id:id}});
    done(null, user);
  } catch (error) {
    done(error);
  }
});

 module.exports = passport;