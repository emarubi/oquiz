const adminMW = (request, response, next) => {
    //l'utilisateur n'est pas connecté
    if (!request.session.user) {
        return response.redirect('/login');
    }
    //le user est connecté ET est un admin
    if (request.session.user.role === 'admin') {
        return next();
    }
    //le user est connecté mais n'est pas admin
    response.render('401');
}

module.exports = adminMW;