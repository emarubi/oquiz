const {Quiz} = require('../models');

module.exports = {
    findOne: (request, response) => {
        Quiz.findByPk(parseInt(request.params.id, 10), {
            //on a besoin ici de nombreuses informations. Certaines sont reliées directement au quiz, d'autres vont être rattachées aux questions du quiz
            //Pour les relations directes, on peut les indiquer sous forme de chaine de caractères dans include
            //Pour les relations à plusieurs niveaux, sans lien direct avec l'entité appelée pour effectuer la requête, on passe par un object afin de pouvoir lui ajouter les propriétés nécessaires
            //Quand on a plusieurs associations à faire sur la même entité, on l'écrit sous la forme d'un tableau
            include: ['author', 'tags', {
                association: 'questions',
                include: ['level', 'answers']
            }]
        }).then(quiz => {
            /*
                quiz = {
                    ...propriété de quiz,
                    author: instance de User,
                    tags: tableau d'instances de Tag
                    questions: tableau d'instances de Question
                        et pour chaque question
                        level: instance Level
                        answers: tableau d'instance de Answer
                }
            */
           response.render('quiz', {quiz});
        })
    }
}