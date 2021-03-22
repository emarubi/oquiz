//on utilise un middleware maison pour initialiser la propriété user dans la session
//par défaut, on va lui donner la valeur false
//si le user est connecté, on va stocker en session les infos le concernant
// le contenu de la session stocké dans response.locals est valable pendant toute la session
const userMW = (request, response, next) => {
    if (!request.session.user) {
        request.session.user = false;
    }
    response.locals.user = request.session.user;
    next();
};

module.exports = userMW;