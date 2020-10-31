//on sépare les préoccupations : Sepration Of Concerns
//Ce module va uniquement gérer la connexion à la base oquiz

//on commence par importer dotenv pour ajouter le contenu de notre .env aux variables d'environnement de l'application
require('dotenv').config();

//on importe la class CLient depuis le module pg
const {Client} = require('pg');

//on se crée une instance en utilisant la variable d'environnement PG_URL
//Cette instance est notre lien JS vers la BDD
const client = new Client(process.env.PG_URL);

//on connecte le client pour le rendre prêt à l'emploi
client.connect();

console.log(`Connection to DB ${process.env.PG_URL} successfull`);

//on le place dans l'export pour le rendre disponible dans d'autres fichiers de l'appli
module.exports = client;