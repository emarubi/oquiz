//on importe les modèles dont on a besoin
const {Quiz} = require('../models/');

//le principe d'un contrôleur : on déclare un gros object avec plusieurs méthodes et on l'exporte
//version plus short : on exporte directement un object anonyme contenant toutes les méthodes
module.exports = {
    home: (request, response) => {
        //on récupère tous les quizzes présent en base
        Quiz.findAll({
            //on ajoute les infos de l'auteur grâce aux relations qu'on a définies
            include: 'author'
        }).then(quizzes => {
            //on passe le résultat de la requête en 2ème argument à render
            //ainsi, on rend le tableau de quizzes disponible dans la vue
            response.render('index', {quizzes});
        }).catch(error => {
            //avec le catch, on peut effectuer un traitement sur les erreurs à la mode Sequelize
            console.log(error);
        });

    }
};