const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')


const Groupe = sequelize.define('groupes', {
    id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idAdmin: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true
      },
      image: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false
      },
      
      nom: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        collate: 'latin1_swedish_ci'
      },
    },
    {
      timestamps: false, // Désactiver les horodatages automatiques
    });


    module.exports = Groupe;
