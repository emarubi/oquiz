const sequelize = require('../database');
const {DataTypes, Model} = require('sequelize');

class Answer extends Model {}

Answer.init(
    {
        description: DataTypes.STRING
    }, 
    {
        sequelize,
        tableName: 'answer'
    }
);

module.exports = Answer;