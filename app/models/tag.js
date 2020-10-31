const sequelize = require('../database');
const {DataTypes, Model} = require('sequelize');

class Tag extends Model {}

Tag.init(
    {
        name: DataTypes.STRING
    },
    {
        //on utilise ici la version raccourcie permise par ES6
        //quand le nom de la propriété et le nom de la variable contenant les infos sont les mêmes, au lieu d'écrire
        // - sequelize: sequelize,
        //on peut écrire directement
        //- sequelize,
        sequelize,
        tableName: 'tag'
    }
);

module.exports = Tag;