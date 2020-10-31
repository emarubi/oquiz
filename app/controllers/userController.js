const {User} = require('../models');
const bcrypt = require('bcrypt');

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
                lastname: user.names,
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
    }
}