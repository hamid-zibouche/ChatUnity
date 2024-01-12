const passport = require('passport')

const isAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, existingUser) => {
      if (existingUser && existingUser.type === 'admin') {
        return next();
      }
      console.log('here : '+existingUser.type)
      res.status(401).json({ message: 'Accès refusé. Vous devez être administrateur.' });
    })(req, res, next);
  };

module.exports ={ isAdmin};