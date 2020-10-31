//on a trouvé un équivalent à la méthode findAll qu'on avait définie dans le CoreModel
//dans Sequelize.Model, toutes les méthodes sont statiques

//on utilise toujours un callback, la notation va être un peu différente
//le callback est passé en paramètre de .then()
//les erreurs éventuelles seront gérées différemment

const {Level, User, Quiz, Question, Tag} = require('./app/models');
require('dotenv').config();

//findAll
// Level.findAll().then(levels => {
//     console.log('Level.findAll');
//     for (const level of levels) {
//         console.log(level.toString());
//     }
// });

//sur une requête vers User, on peut inclure les quizzes dont il est l'auteur
// User.findByPk(3, {
//     //en ajoutant include, on indique à Sequelize de faire un JOIN avec la relation appelée quizzes (as: 'quizzes')
//     //Sequelize ajoute une propriété quizzes à notre instance
//     //cette propriété va contenir un tableau contenant tous les quizzes écrits par cet utilisateur
//     //include accepte une string, un tableau de string, un object, un tableau contenant des strings et des objects
//     include: 'quizzes'
// }).then(user => {
//     console.log(user.getFullname() + ' est l\'auteur de ' + user.quizzes.length + ' quizzes');
// });

//on veut obtenir la question d'id 10 ET le quiz associé
// Question.findByPk(10, {
//     include: 'quiz'
// }).then(question => {
//     console.log(question.toString());
//     console.log('Quiz de cette question : ', question.quiz.id);
// });

//quiz d'id 12 ET les questions associées
// Quiz.findByPk(12, {
//     include: 'questions'
// }).then(quiz => {
//     console.log(quiz.title, 'comporte', quiz.questions.length, 'questions');
// });


// //le quiz d'id 5 et les tags associés
// Quiz.findByPk(5, {
//     include: 'tags'
// }).then(quiz => {
//     console.log(quiz.title, 'contient', quiz.tags.length, 'tags');
// })

// //le tag d'id 3 et les quizzes associés
// Tag.findByPk(3, {
//     include: 'quizzes'
// }).then(tag => {
//     console.log(tag.name, 'contient', tag.quizzes.length, 'quizzes');
// });


//le niveau Débutant, les questions associées, la bonne réponse à chaque question et les réponses possibles

// Level.findOne({
//     where: {name: 'Débutant'},
//     include: {
//         association: 'questions',
//         include: ['answers', 'good_answer']
//     }
// }).then(level => {
//     console.log('Le niveau', level.name, 'contient', level.questions.length, 'questions');
//     const question = level.questions[0];
//     console.log('Question d\'id', question.id, 'a', question.answers.length, 'réponses possibles');
//     console.log('La bonne réponse est celle d\'id', question.good_answer.id);
// });


//Trouver pour l'utilisateur d'id 3, les quizzes dont il est l'auteur, les questions associées et leur bonne réponse
User.findByPk(3, {
    include: {
        association: 'quizzes',
        include: {
            association: 'questions',
            include: 'good_answer'
        }
    }
})

//Trouve pour le niveau d'id 1 les questions associées, leur quiz et les thèmes de chaque quiz
Level.findByPk(1, {
    include: {
        association: 'questions',
        include: {
            association: 'quiz',
            include: 'tags'
        }
    }
})