//fichier catalogue permettant d'effectuer un require global sur les modèles

//on commence par importer tous nos modèles
//on laisse juste de côté CoreModel, on en a jamais besoin explicitement dans notre appli
const Answer = require('./answer');
const Level = require('./level');
const Question = require('./question');
const Quiz = require('./quiz');
const Tag = require('./tag');
const User = require('./user');


//mise en place des relations

//on va avoir plusieurs cas

//relation 1,1
//On utilise la méthode belongsTo sur la table qui détient la clé étrangère
//pas de contrepartie sur l'autre table dans ce cas


//relation 1,n
//Pour la table qui détient n, on utilise la méthode hasMany
//Pour la table qui détient 1, on utilise la méthode belongsTo


//relation n,n
//on passe par une table intermédiaire pour stocker les relations entre les 2 tables
//on utilise la méthode belongsToMany sur les 2 modèles en indiquant la table intermédiaire et les clé dans cette table



//un utilisateur a plusieurs quizzes (n) =>hasMany
//1er argument : le modèle à lier
//2ème argument : object de configuration
User.hasMany(Quiz, {
    //la clé étrangère qu'on doit retrouver dans Quiz
    foreignKey: 'user_id',
    //le nom qu'on souhaite donner aux quizzes dans user si on fait un join
    as: 'quizzes'
});

//un quiz n'a qu'un seul utilisateur/auteur (1) => belongsTo
Quiz.belongsTo(User, {
    //la clé étrangère qu'on doit trouver dans quiz
    foreignKey: 'user_id',
    //le nom qu'on souhaite donner au user dans quiz si on fait un join
    as: 'author'
});

//un quiz a plusieurs questions (n) => hasMany
Quiz.hasMany(Question, {
    foreignKey: 'quiz_id',
    as: 'questions'
});

//une question n'appartient qu'à un seul quiz (1) => belongsTo
Question.belongsTo(Quiz, {
    foreignKey: 'quiz_id',
    as: 'quiz'
});

//un niveau contient plusieurs question (n) => hasMany
Level.hasMany(Question, {
    foreignKey: 'level_id',
    as: 'questions'
});

//une question n'a qu'un seul niveau (1) => belongsTo
Question.belongsTo(Level, {
    foreignKey: 'level_id',
    as: 'level'
});


//une question a plusieurs possibilités de réponses (n) => hasMany
Question.hasMany(Answer, {
    foreignKey: 'question_id',
    as: 'answers'
});

//une réponse possible n'appartient qu'à une seule question (1) => belongsTo
Answer.belongsTo(Question, {
    foreignKey: 'question_id',
    as: 'question'
});


//cas particulier de question et réponse, on a une deuxième relation à indiquer : la bonne réponse (1)
//la clé étrangère se trouve dans question, on ajoute une relation belongsTo pour obtenir la bonne réponse dans l'instance de Question
Question.belongsTo(Answer, {
    foreignKey: 'answer_id',
    as: 'good_answer'
});


//un quiz peut avoir plusieurs thèmes (n)
Quiz.belongsToMany(Tag, {
    //le nom du champ de Quiz dans la table intermédiaire
    foreignKey: 'quiz_id',
    //le nom du champ de Tag dans la table intermédiaire
    otherKey: 'tag_id',
    //le nom de la propriété dans Quiz si on fait un join
    as: 'tags',
    //le nom de la table intermédiare
    through: 'quiz_has_tag'
});

//un thème peut avoir plusieurs quizzes (n)
Tag.belongsToMany(Quiz, {
    //le nom du champ de Tag dans la table intermédiaire
    foreignKey: 'tag_id',
    //le nom du champ de Quiz dans la table intermédiaire
    otherKey: 'quiz_id',
    //le nom de la propriété dans Tag si on fait un join
    as: 'quizzes',
    //le nom de la table intermédiaire
    through: 'quiz_has_tag'

});





//on exporte le tout dans un object global
//on utilise la notation ES6 simplifiée

module.exports = {
    Answer,
    Level,
    Question,
    Quiz,
    Tag,
    User
}