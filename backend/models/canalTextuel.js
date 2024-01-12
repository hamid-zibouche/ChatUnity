const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const CanalTextuel = sequelize.define('chanel_textuel', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING(50),
    collate: 'utf8mb4_bin',
    allowNull: false,
  },
  idServer: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
      
  },
  {
    timestamps: false, // Désactiver les horodatages automatiques
  });

  module.exports = CanalTextuel;
