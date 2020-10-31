//on importe notre client sequelize
const sequelize = require('../database');

//on ajoute les classes du package dont on a besoin
const {DataTypes, Model} = require('sequelize');


class Level extends Model {

    toString() {
        return `Niveau : ${this.name}, id: ${this.id}`;
    }
}

//on utilise la méthode statique init héritée de Model pour configurer notre modèle

Level.init(
    //1er argument : un object qui décrit les champs de la table
    //Pas besoin d'indiquer le champ id, Sequelize l'ajoute automatiquement
    {
        //on définit un champ en indiquant son nom et son type
        name: DataTypes.STRING
    },
    //2nd argument : un object avec les infos de connexion
    {
        //instance du client sequelize
        sequelize,
        //on indique le nom de la table dans la BDD
        tableName: 'level'
    }
);


module.exports = Level;


/*

Notre but est de toujours maintenir la version JS d'un modèle et sa version persistance en BDD aussi synchro que possible.
On a :
- une recette de quiche lorraine (notre Class)
- une quiche Lorraine (notre object concret fabriqué à partir de la recette)
- une photo de la quiche qui a été postée sur facebook (enregistrement en BDD)

Quand on veut créer/modifier/supprimer notre recette et notre quiche, on refait une photo pour garder notre facebook à jour (JS -> BDD, on utilise une instance existante, on peut donc effectuer ces opérations avec une méthode d'instance)

Quand on veut partir de la photo pour recuisiner la quiche, on va avoir besoin de la recette pour la refaire à l'identique (BDD -> JS, on utilise ici une méthode statique, accrochée à la recette , pour recréer notre instance)

*/
