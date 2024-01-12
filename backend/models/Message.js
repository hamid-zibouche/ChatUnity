const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');



const Message = sequelize.define('Message', {
  messageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  idChanel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contenu: {
    type: DataTypes.STRING(254),
      allowNull: true,
  },
  image: {
    type: DataTypes.BLOB('long')
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'messages',
  timestamps: false
});




Message.sync();

module.exports = Message;