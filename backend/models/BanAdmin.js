const Sequelize = require('sequelize')
const sequelize = require('../config/sequelize')

const banAdmin = sequelize.define('banadmin',{
    idbanni: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
      },
      idadmin: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
      },
      Raison: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
},
{
    timestamps: false, // Désactiver les horodatages automatiques
  })
module.exports = banAdmin;