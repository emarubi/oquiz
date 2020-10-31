//on sépare les préoccupations : Sepration Of Concerns
//Ce module va uniquement gérer la connexion à la base oquiz

//on commence par importer dotenv pour ajouter le contenu de notre .env aux variables d'environnement de l'application
//require('dotenv').config();

//on importe la class dont on a besoin
const {Sequelize} = require('sequelize');

//on crée une instance de la class en la configurant avec notre variable PG_URL
const sequelize = new Sequelize(
    process.env.PG_URL,
    {
        define: {
            //permet les noms de champs en snake_case
            underscored: true,
            //on ajoute une propriété de config pour désactiver l'ajout automatique de 2 champs à nos modèles :
            //- createdAt
            //- updatedAt
            timestamps: false
        }
    }
);

//notre client est prêt, on l'exporte pour l'utiliser dans nos modèles
module.exports = sequelize;