const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');
const Users = require('./utilisateurs');
const Groupes = require('./groupe'); // Assurez-vous d'importer le modèle de groupes

const MessagesGroupe = sequelize.define('messages_groupes', {
  idUser: {
    type: Sequelize.DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Users,
      key: 'id',
    },
  },
  idGroupe: {
    type: Sequelize.DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Groupes, // Modèle de référence pour les groupes
      key: 'id', // Colonne de référence dans le modèle Groupes
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
  timestamps: false,
});

sequelize.sync({ force: false });

module.exports = MessagesGroupe;

