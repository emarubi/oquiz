const express = require('express');

//TODO : importer les contrôleurs
const mainController = require('./controllers/mainController');
const quizController = require('./controllers/quizController');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const tagController = require('./controllers/tagController');

const adminMW = require('./middlewares/adminMW');

const router = express.Router();

//TODO : routes à définir
//page d'accueil
router.get('/', mainController.home);
//détail d'un quiz
router.get('/quiz/:id', quizController.findOne);


//tous les thèmes
router.get('/tags', tagController.getAllTags);

//infos d'un thèmes
router.get('/tag/:id', tagController.getOneTag);


//affichage du formulaire de login
router.get('/login', userController.login);
//traitement du formulaire
router.post('/login', userController.doLogin);

//se déconnecter
router.get('/logout', userController.logout);

//profile
router.get('/profile', userController.profile);

//s'inscrire
router.get('/signup', userController.signup);
//traitement du formulaire
router.post('/signup', userController.doSignup);


//interface d'administration
//cette route sera protégée par le middleware adminMW
//Seuls les utilisateurs de rôle admin pourront accéder à la page
router.get('/admin', adminMW, adminController.adminPage);

//on exporte le routeur pour l'utiliser dans le reste de l'appli (index.js)
module.exports = router;