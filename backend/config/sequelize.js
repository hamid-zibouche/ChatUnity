const Sequelize = require('sequelize');

const sequelize = new Sequelize ('chatDB','root','',{
    host:'localhost',
    dialect: 'mysql'
  }
  );

  sequelize.authenticate().then(()=>{
    console.log('connexion data base succesful');
}).catch((error)=>{
    console.error('erreur de connexion a la base de donnee :',error);
});

  module.exports = sequelize;