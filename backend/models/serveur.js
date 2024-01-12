const Sequelize = require('sequelize')
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Serveur = sequelize.define('server', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nom: {
        type: DataTypes.STRING(50),

        allowNull: false,
      },
      image: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      idCreateur: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

    },
    {
      timestamps: false, // Désactiver les horodatages automatiques
    });




module.exports = Serveur;