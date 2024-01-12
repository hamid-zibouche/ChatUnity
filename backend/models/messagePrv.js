const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')
const Users = require("./utilisateurs")

const MessagesPrv = sequelize.define('messages_prvs', {
    idUser1: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Users, // Modèle de référence
        key: 'id', // Colonne de référence dans le modèle Users
      },
    },
    idUser2: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Users, // Modèle de référence
        key: 'id', // Colonne de référence dans le modèle Users
      },
    },
    contenu: {
      type: Sequelize.DataTypes.STRING(254),
      allowNull: true,
    },
    image: {
      type: Sequelize.DataTypes.BLOB,
      allowNull: true,
    },
    date: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: false, // Désactive les timestamps automatiques
  });

  sequelize.sync({ force: false });

  module.exports = MessagesPrv;