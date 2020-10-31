//on importe le dataMapper
//const dataMapper = require('./app/dataMapper');



// dataMapper.getAllLevels((error, levels) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         for (const level of levels) {
//             console.log(level.toString());
//         }
//     }
// });


// dataMapper.getOneLevel(1, (error, level) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(level.toString());
//     }
// });

//on importe maintenant le modèle Level qui héberge ses propres méthodes d'accès à la base

const {User, Question, Level, Quiz, Tag} = require('./app/models');


// Quiz.findOne(4, (error, quiz) => {
//     if (error) {
//         console.log('Erreur', error);
//     } else {
//         console.log(quiz.toString()+'\n');
//     }
// });

// Question.findOne(3, (error, question) => {
//     if (error) {
//         console.log('Erreur', error);
//     } else {
//         console.log(question.toString()+'\n');
//     }
// });

// const level = new Level({name: 'Très difficile'});

// level.insert((error, level) => {
//     if (error) {
//         console.log('Erreur', error);
//     } else {
//         console.log(level.toString()+'\n');
//     }
// });

const parameters = {
    name: 'Très difficile'
}

Level.findBy(parameters, (error, instances) => {
    if (error) {
        console.log('Erreur', error);
    } else {
        for (const instance of instances) {
            console.log(instance.toString());
        }
    }
});


// Level.findAll((error, levels) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         for (const level of levels) {
//             console.log(level.toString());
//         }
//     }
// });

// Level.findOne(3, (error, level) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(level.toString());
//     }
// });

// const level = new Level({name: 'Super dur'});
// level.insert((error, instance) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(instance.toString());
//     }
// });

// const level = new Level({id: 4, name: 'Super dur'});
// level.name = 'Super méga dur';
// level.update((error, instance) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(instance.toString());
//     }
//     Level.findOne(4, (error, result) => {
//         if (error) {
//             console.log('Y a eu un pépin');
//         } else {
//             console.log(result.toString());
//         }
//     });
// });


// const level = new Level({id: 4, name: 'Super méga dur'});
// level.delete((error, result) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log('Suppression effectuée : ', result);
//     }
// });



// User.findAll((error, users) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         for (const user of users) {
//             console.log(user.getFullname());
//         }
//     }
// });



// User.findOne(3, (error, user) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(user.getFullname());
//     }

// });

// const user = new User({email: 'nico@oclock.io', password: '123456', firstname: 'Nico', lastname: 'Charpin'});
// user.insert((error, instance) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(instance.getFullname(), instance.id);
//     }
// });

// const user = new User({id: 5, email: 'nico@oclock.io', password: '123456', firstname: 'Nico', lastname: 'Charpin'});
// user.update((error, instance) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(instance.getFullname(), instance.id);
//         User.findOne(5, (error, result) => {
//             if (error) {
//                 console.log('Y a eu un pépin');
//             } else {
//                 console.log('From BDD', result.getFullname());
//             }
//         })
//     }
// });

// const user = new User({id: 5});
// user.delete((error, result) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log('Enregistrement supprimé', result);
//         User.findOne(5, (error, instance) => {
//             console.log(error);
//         })
//     }
// });



// Quiz.findAll((error, quizzes) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         for (const quiz of quizzes) {
//             console.log(quiz.toString());
//         }
//     }
// });


// Question.findOne(1, (error, question) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(question.toString());
//     }
// });



// const tag = new Tag({name: 'Physique quantique'});
// tag.insert((error, instance) => {
//     if (error) {
//         console.log('Y a eu un pépin');
//     } else {
//         console.log(instance);
//     }
// });

//exemple de boucle pour afficher les propriétés d'un object et leur valeur

const params = {
    firstname: 'Nico',
    email: 'nico@oclock.io'
}

for (const paramName in params) {
    //1ere itération, paramName = 'firstname'
    //2ème itération, paramName = 'email'
    console.log('Propriété : ', paramName, ' - Valeur : ', params[paramName])
}