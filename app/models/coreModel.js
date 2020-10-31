const client = require('../database');

class CoreModel {

    _id;

    static tableName = null;

    constructor(obj) {
        this._id = obj.id;
    }

    //getter
    get id() {
        return this._id;
    }

    //setter
    set id(value) {
        //on commence par faire une vérification du type avant de mettre à jour la propriété
        //En cas d'erreur, on va 'jeter' une erreur afin que le développeur/utilisateur de notre classe sache qu'il l'a mal utilisée
        if (isNaN(parseInt(value, 10))) {
            throw new Error('id doit être de type number');
        }
        this._id = parseInt(value, 10);
    }

    //récupérer toutes les instances d'un modèle
    //le mot-clé static nous permet de rattacher une méthode (ou même une propriété) à la class et non plus à l'object fabriqué par cette classe
    //Pour un Active Record, toutes les méthodes ayant pour but de générer des instances de modèles seront déclarées en static
    static findAll(callback) {
        console.log('On est bien dans le findAll de CoreModel');
        console.log('Ici, this vaut', this);
        client.query(`SELECT * FROM "${this.tableName}"`, (error, results) => {
            if (error) {
                //si la BDD a renvoyé une erreur, on utilise le callback pour le signaler au module qui a appelé la méthode
                callback(error, null);
            } else {
                //on a obtenu des résultats de la BDD. On va les stocker dans un tableau d'instances de Level
                const instances = [];
                for (const row of results.rows) {
                    //le constructeur de Level va savoir mapper les infos de la ligne (de l'enregistrement) dans les propriétés de l'object fabriqué
                    instances.push(new this(row));
                }
                //on a le tablea levels qui contient nos instances, on utilise le callback pour le renvoyer au module appelant
                callback(null, instances);
            }
        });
    }

    static findOne(id, callback) {
        client.query(`SELECT * FROM "${this.tableName}" WHERE "id"=$1`, [id], (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                //on récupère un enregistrement de la table voulue
                //results.rows est un tableau, on en extrait le 1er élément
                if (results.rows.length === 1) {
                    const instance = new this(results.rows[0]);
                    callback(null, instance);
                } else {
                    callback('Enregistrement non trouvé', null);
                }
            }
        });    
    }

    //Pour insérer un nouvel enregistrement en base, on part d'une instance qu'on aura créée
    //La méthode d'insertion sera une méthode d'instance, elle ne sera pas rattaché à la class mais bien à un object fabriquée par la classe
    insert(callback) {
        console.log('On est bien dans le insert de CoreModel');
        console.log('Ici, this vaut', this);

        //on a besoin d'accéder à la propriété statique tableName mais ici, on n'a pas un accès direct à la classe qui a généré notre instance
        //this.constructor constient une référence vers la class de l'object
        //on peut l'utiliser pour accéder aux propriétés statiques depuis une méthode d'instance
        const tableName = this.constructor.tableName;

        //on va avoir besoin de 3 tableaux
        //- un pour les noms des propriétés (sans le _)
        //- pour les valeurs de nos propriétés
        //- un pour la position des propriétés dans la requête

        //précision : le champ _id devra être ignoré ici puisque c'est PostgreSQL qui nous donnera sa valeur après la requête

        //on déclare 3 tableaux pour stocker le nom des champs, leur valeur pour l'instance courante et leur position dans la requête
        const fieldNames = [];
        const fieldValues = [];
        const fieldIndex = [];

        let index = 1;
        //on parcourt l'object courant avec une boucle
        //Attention, il ne faut pas prendre en compte l'id, il sera automatiquement créé à l'insertion en BDD

        for (let fieldName in this) {

            //on fait tout de suite le test sur le champ _id pour ne pas l'inclure dans le traitement
            if (fieldName === '_id') {
                //on utilise continue pour passer à l'itération suivante
                //la suite du code ne sera pas exécutée
                continue;
            }

            //on récupère déjà la valeur du champ
            //on ne connait pas directement le nom de la propriété à laquelle on souhaite accéder ici : on ne peut donc pas utiliser la syntaxe qu'on connait le plus : <nom_obj>.<nom_propriete>
            //JS met à dispo une autre façon d'accéder aux valeurs d'une propriété avec la syntaxe à la mode tableau
            //<nom_obj>['<nom_propriete>']
            //ce nom de propriété peut être contenu dans une variable, on mettra donc directement le nom de la variable (sans quotes) entre les crochets
            //<nom_obj>[<nom_variable>]
            fieldValues.push(this[fieldName]);

            //on stocke la position du champ dans la requête
            fieldIndex.push(`$${index++}`);
            //version plus détaillée
            //fieldIndex.push('$'+index);
            //index++;

            //on enlève le _ en début de nom avec la méthode subtring
            fieldName = fieldName.substring(1);
            //le nom du champ est nettoyé, on peut l'ajouter à notre tableau
            //on en profite pour ajouter les double quotes autour du nom du champ
            fieldNames.push(`"${fieldName}"`);
        }

        const preparedQuery = {
            //dans la requête on utilise RETURNING pour récupérer le nouvel id générer à l'insertion
            //on l'utilisera pour mettre à jour l'instance de Level dans JS
            text: `INSERT INTO "${tableName}" (${fieldNames.join(', ')}) VALUES(${fieldIndex.join(', ')}) RETURNING "id"`,
            values: fieldValues
        };
        console.log(preparedQuery);
        client.query(preparedQuery, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                //on utilise la propriété rowCount pour checker qu'on a obtenu une valeur de retour grâce à RETURNING
                //si rowCount vaut 0, c'est qu'on a eu un problème
                if (results.rowCount > 0) {
                    //l'insertion a fonctionné, on peut mettre à jour notre object JS avec l'id que nous a envoyé PostgreSQL
                    this.id = results.rows[0].id;
                    callback(null, this);
                } else {
                    callback('Aucun id reçu en retour', null);
                }
            }
        });
    }

    //pour la mise à jour, on part également d'une instance existante dans JS
    //la méthode va de JS vers la BDD, pas besoin de static ici
    update(callback) {
        console.log('On est bien dans le update de CoreModel');
        console.log('Ici, this vaut', this);

        const tableName = this.constructor.tableName;

        const fieldUpdates = [];
        const fieldValues = [];

        let index = 1;
        //  1       2           3           4
        // [email, password, firstname, lastname]
        //  2       3           4           5
        // ['nico@oclick.io', '123456', 'Nico', 'Charpin']
        //UPDATE "user" SET email=$1, password=$2, firstname=$3, lastname=$4 WHERE id=$5

        //on parcourt l'objet courant avec une boucle
        for (let fieldName in this) {
            //on ajoute un test pour ne pas inclure _id dans le traitement
            if (fieldName === '_id') {
                continue;
            }

            //on récupère la valeur du champ
            fieldValues.push(this[fieldName]);

            //on enlève le _ en début de nom avec substring, on va garder tous les caractères SAUF le 1er
            fieldName = fieldName.substring(1);

            //on va créer l'update qui correspond à ce champ
            fieldUpdates.push(`"${fieldName}"=$${index++}`);

        }

        //après la boucle, on ajoute la valeur de l'id au tableau des values
        fieldValues.push(this.id);

        //l'instance JS a déjà ses propriétés à jour, pas besoin de RETURNING
        //on se contente de faire persister nos données, de reporter les modifs du code en BDD
        const preparedQuery = {
            //après la boucle, on peut utiliser index sans autre manipulation pour indiquer la position de l'id dans le tableau
            //En effet, avant la sortie de la boucle, index est incrémenté une dernière fois. Il a donc bien la valeur attendue pour le dernier joker de la requête
            text: `UPDATE "${tableName}" SET ${fieldUpdates.join(', ')} WHERE "id"=$${index}`,
            values: fieldValues
        };
        client.query(preparedQuery, (error, results) => {

            if (error) {
                return callback(error, null);
            }
            //lors d'un update, results.rowCount contient le nombre de lignes modifiées
            //on checke rowCount pour vérifier qu'au moins une ligne a été modifiée
            if (results.rowCount > 0) {
                callback(null, this);
            } else {
                callback('Aucun enregistrement modifié', null);
            }

        });
    }

    //pour la suppression, on part de nouveau d'une instance existante dans JS pour aller supprimer un enregistrement en BDD
    delete(callback) {
        console.log('On est bien dans le delete de CoreModel');
        console.log('Ici, this vaut', this);
        const tableName = this.constructor.tableName;

        const preparedQuery = {
            text: `DELETE FROM "${tableName}" WHERE "id"=$1`,
            values: [this.id]
        };

        client.query(preparedQuery, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                //lors d'un DELETE, results.rowCount contient le nombre de lignes supprimées
                //on checke rowCOunt pour vérifier qu'au moins une ligne a été supprimée
                if (results.rowCount > 0) {
                    //ici, c'est une suppression, on ne renvoie pas l'instance qui est sensée ne plus exister
                    //on renvoie à la place un boolean qui va indiquer au contrôleur si tout s'est bien passé ou pas
                    callback(null, true);
                } else {
                    callback('Aucun enregistrement supprimé', false);
                }
            }
        });
    }

    static findBy(params, callback) {
        //on a besoin d'un tableau pour stocker les critères de recherche
        const wheres = [];
        //également d'un tableau pour stocker les valeurs des paramètres
        const values = [];
        //et d'un index pour la position des valeurs
        let index = 1;

        //SELECT * FROM <table> WHERE critere1=$1 AND critere2=$2

        //on boucle sur le nom des paramètres
        for (const paramName in params) {
            //on stocke le critère à ajouter dans le WHERE
            wheres.push(`"${paramName}"=$${index++}`);
            //on stocke la valeur du paramètre à rechercher
            values.push(params[paramName]);
        }
        //les données dont on a besoin sont stockées, on peut générer la requête
        //le WHERE doit être de la forme critere1=xxx AND critere2=YYY
        //dans le join, on n'utilisera pas ', ' comme séparateur mais plutôt ' AND '
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}" WHERE ${wheres.join(' AND ')}`,
            values
        };

        client.query(preparedQuery, (error, results) => {
            if (error) {
                callback(error, null);
            } else {
                const instances = [];
                for (const row of results.rows) {
                    instances.push(new this(row));
                }
                callback(null, instances);
            }
        });
    }

    save(callback) {
        //pour vérifier si un enregistrement existe déjà en BDD, on regarde si l'instance JS a un id renseigné
        //si on a un id, enregistrement a déjà été effectué => update
        //sinon, pas encore d'enregistrement enbase => insert
        if (this.id) {
            this.update(callback);
        } else {
            this.insert(callback);
        }
    }


}

module.exports = CoreModel;

