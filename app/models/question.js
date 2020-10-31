const sequelize = require('../database');
const {DataTypes, Model} = require('sequelize');

class Question extends Model {
    toString() {
        return `${this.question}, ${this.anecdote}`;
    }
}

Question.init(
    {
        question: DataTypes.STRING,
        anecdote: DataTypes.STRING,
        wiki: DataTypes.STRING
        //on igore pour l'instant les clé étrangères
    },
    {
        sequelize,
        tableName: 'question'
    }
);

module.exports = Question;