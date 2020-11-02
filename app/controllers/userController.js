const {User} = require('../models');
const bcrypt = require('bcrypt');
// require du module email-validator
const validator = require("email-validator");

module.exports = {
    login: (request, response) => {
        response.render('login');
    },
    doLogin: (request, response) => {
        //on cherche à identifier l'utilisateur à partir de son email
        User.findOne({where: {email: request.body.email}}).then(user => {
            if (!user) {
                return response.render('login', {error: 'Utilisateur non trouvé', fields: request.body});
            }

            //l'utilisateur avec cet email existe, on vérifie son mot de passe en comparant :
            //- la version en clair (saisie dans le formulaire)
            //- la version hashée (stockée en BDD)
            //bcrypt est capable de déterminer sie les 2 versions correspondent
            const validPwd = bcrypt.compareSync(request.body.password, user.password);
            if (!validPwd) {
                //la vérification a échoué, on renvoie la vue login avec un message d'erreur et les champs saisis
                return response.render('login', {error: 'Problème d\'authentification', fields: request.body})
            }
            //l'utiliisateur existe et s'est correctement identifié, on stocke les infos utiles en session
            request.session.user = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            }

            if (request.body.remember) {
                //l'utilisateur a coché la case 'Se souvenir de moi'
                //on ajoute une heure de validité à son cookie
                //il peut ainsi quitter son navigateur et revenir sur la page, il sera toujours connecté
                // on indique en date d'expiration la date du moment + 1 h (en milliseconds)
                request.session.cookie.expires = new Date(Date.now() + 3600000);
            }
            //le user est bien connecté et ses infos stockées en session, on le redirige vers la page d'accueil
            response.redirect('/');
        });
    },
    logout: (request, response) => {
        //on reset les infos du user en session
        request.session.user = false;
        //on redirige vers la page d'accueil
        response.redirect('/');
    },
    profile: (request, response) => {

            response.render('profile');
   
    },
    signup: (request, response) => {
        response.render('signup');
    },
    doSignup: (request, response) => {

            // 1 firstname ne doit pas être vide
            if (!request.body.firstname || request.body.firstname.length === 0) {
                return response.render('signup', {error: 'Le prénom ne doit pas être vide', fields: request.body});
            }
            // 2 lastname ne doit pas être vide
            if (!request.body.lastname || request.body.lastname.length === 0) {
                return response.render('signup', {error: 'Le prénom ne doit pas être vide', fields: request.body});
            }
            // 3 l'email doit être valide
            if (!validator.validate(request.body.email)) {
                return response.render('signup', {error: 'L\'adresse email n\'est pas correcte', fields: request.body})
            }

            // imposer un mot de passe d'une longueur minimum de 8 caractères
            if (!request.body.password || request.body.password.length < 8) {
                return response.render('signup', {error: 'Le mot de passe doit contenir au moins 8 caractères', fields: request.body})
            } 
            // confirmer le mot de passe
            if (request.body.password !== request.body.passwordConfirm) {
                return response.render('signup', {error: 'Veuillez confirmer le mot de passe', fields: request.body})
            } 

            //on cherche à identifier l'utilisateur à partir de son email
            User.findOne({where: {email: request.body.email}}).then(user => {
                //l'utilisateur avec cet email existe: on retourne un message d'eereur et on reaffiche la page signup
                if (user) {
                    return response.render('signup', {error: 'Un utilisateur avec cet email existe déjà!', fields: request.body});
                } else {
                    // je stocke le mot de passe en le hashant
                    const hashedPassword = bcrypt.hashSync(request.body.password, 10);

                    // je peux créer une instance de User 
                    const newUser = new User({
                        firstname: request.body.firstname,
                        lastname: request.body.lastname,
                        email: request.body.email,
                        password: hashedPassword,
                        role: 'user'
                    });

                    newUser.save().then( () => {
                        //le user est bien connecté et ses infos stockées en session, on le redirige vers la page d'accueil
                        response.redirect('/login');
                    })
                }
            });

          //l'utiliisateur existe et s'est correctement identifié, on stocke les infos utiles en session
            request.session.user = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            }
            

 
        
    }
}