//on importe le client pg prêt à l'emploi
const client = require('./database');

//on importe un 1er modèle pour générer des instances (des objects JS concrets) à partir des données reçues de la BDD
const Level = require('./models/level');

const dataMapper = {
    //on va définir les méthodes qui vont récupérer les infos en BDD
    //ces méthodes auront toutes (au moins) un paramètre callback qui sera exécuté quand la BDD aura répondu

    //récupérer tous les niveaux
    getAllLevels: (callback) => {
        client.query('SELECT * FROM "level"', (error, results) => {
            if (error) {
                //si la BDD a renvoyé une erreur, on utilise le callback pour le signaler au module qui a appelé la méthode
                callback(error, null);
            } else {
                //on a obtenu des résultats de la BDD. On va les stocker dans un tableau d'instances de Level
                const levels = [];
                for (const row of results.rows) {
                    //le constructeur de Level va savoir mapper les infos de la ligne (de l'enregistrement) dans les propriétés de l'object fabriqué
                    levels.push(new Level(row));
                }
                //on a le tablea levels qui contient nos instances, on utilise le callback pour le renvoyer au module appelant
                callback(null, levels);
            }
        });
    },

    getOneLevel: (levelId, callback) => {
        client.query('SELECT * FROM "level" WHERE "id"=$1', [levelId], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                //on récupère le niveau
                //results.rows est un tableau, on en extrait le 1er élément
                if (results.rows.length === 1) {
                    const level = new Level(results.rows[0]);
                    callback(null, level);
                } else {
                    callback('Enregistrement non trouvé', null);
                }
            }
        });
    }
};

module.exports = dataMapper;