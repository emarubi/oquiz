const sequelize = require('../database');
const {DataTypes, Model} = require('sequelize');

class User extends Model {

    getFullname() {
        return `${this.firstname} ${this.lastname}`;
    }
}

User.init(
    {
        email: {type: DataTypes.STRING, validate: {isEmail: true}},
        password: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        role: DataTypes.STRING
    },
    {
        sequelize,
        tableName: 'user'
    }
);

module.exports = User;