//on charge nos variables d'environnement
require('dotenv').config();

const express = require('express');

const app = express();
//on utilise la variable d'environnement PORT pour attribuer un port à notre appli
//en cas de pépin, on se rabat sur une valeur par défaut
const PORT = process.env.PORT || 3000;

//configuration pour utiliser EJS comme moteur de templates
app.set('view engine', 'ejs');
app.set('views', './app/views');

//on ajoute les ressources statiques
//on ne va pas utiliser les fichiers html mais des vues EJS
//le middleware static servira uniquement pour les fichiers css
app.use(express.static('./integration/css'));

//on va avoir des formulaires traités en POST, on ajoute le middleware urlencoded
app.use(express.urlencoded({extended: true}));


const session = require('express-session');
app.use(session({
    secret: 'dnqfl dksgnledl',
    resave: false,
    saveUninitialized: true
}));

const userMW = require('./app/middlewares/userMW');
app.use(userMW);

//TODO : routeur à ajouter
const router = require('./app/router');
app.use(router);

//on lance le serveur
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
