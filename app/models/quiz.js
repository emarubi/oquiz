const sequelize = require('../database');
const {DataTypes, Model} = require('sequelize');

class Quiz extends Model {

    toString() {
        return `${this.title}, ${this.description}`;
    }
}

Quiz.init(
    {
        title: DataTypes.STRING,
        description: DataTypes.STRING
    },
    {
        sequelize,
        tableName: 'quiz'
    }
)

module.exports = Quiz;