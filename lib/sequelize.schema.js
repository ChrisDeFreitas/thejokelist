/*
 sequelize.schema.js
 by Chris DeFreitas

*/
const { DataTypes } = require('sequelize')

module.exports.schemas = {
  joke:{
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: 'test column comment'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'imported category'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'imported title'
    },
    body:{
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'length for text types is unlimited'
    },
    id_original: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'imported id'
    },
    score:{
      type: DataTypes.DECIMAL,
      allowNull: true,
      comment: 'imported score'
    },
    rating:{
      type: DataTypes.DECIMAL,
      allowNull: true,
      comment: 'imported rating'
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'source of record'
    }
  },
  category: {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
}

module.exports.indexes = {
  joke:[
    { name: 'idxCategory',
      fields: ['category']
    },{
      name: 'idxTitle',
      fields: ['title']
//      },{
//        name: 'idxBody',
//        fields: 'body',
//        type: ''
    }
  ],
  category:[{
      name: 'idxName',
      fields: ['name']
  }]
}