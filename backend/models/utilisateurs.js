const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')


const Utilisateurs = sequelize.define('users', {
    id: {
      type: Sequelize.DataTypes.BIGINT(26),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nom: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
    },
    prenom: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
    },
    pseudo: {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
    },
    mdp: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false,
    },
    image: {
      type: Sequelize.DataTypes.BLOB,
      allowNull: false,
    },
    type: {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'utilisateur',
    },
    },
    {
      timestamps: false, // Désactiver les horodatages automatiques
    });


    module.exports = Utilisateurs;