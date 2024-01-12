const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const MembresGroupe = sequelize.define('Membres_groupes', {
  
    idGroupe: {
      primaryKey: true,
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
    },
    idUser: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
    },
    banni: {
      type: Sequelize.DataTypes.TINYINT,
      autoIncrement: true,
      allowNull: false,
    },

  },
  {
    timestamps: false, // Désactiver les horodatages automatiques
  });

  
  module.exports = MembresGroupe;
  
  
  
  
  
  
  

