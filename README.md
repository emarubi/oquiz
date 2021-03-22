# Oquiz - Gestion de projet

Après analyse de la demande client, on a listé les cas d'utilisation de l'application

On a réalisé quelques wireframes pour avoir une idée de l'organisation des données dans nos vues

A partir des use cases, on a défini les entités et réalisé le MCD.

En utilisant l'analyse préliminaire de la BDD, le MCD, j'ai créé le MLD de l'application 

Ensuite j'ai créé le fichier SQL pour créer les tables listées dans le MLD.

## Mettre en place la base de données :

- Créer un utilisateur PostgreSQL, nommé "oquiz", avec un mot de passe et les droits nécessaires.
- Créer une base de données nommée "oquiz", dont le propriétaire est l'utilisateur "oquiz".
- Créer les tables grâce au fichier "import_tables.sql".
- Importer les données grâce au fichier "import_data.sql".

### Créer un utilisateur PostgreSQL, nommé "oquizz", avec un mot de passe et les droits nécessaires.

- d'abord se connecter à PostgreSQL en tant que "postgres": `sudo -i -u postgres`, puis `psql`
- Ou directement si cela est déjà configurer dans le `pg_hba.conf` vous pouvez directement untiliser la commande `psql -U postgres`
- puis créer l'utilisateur : `CREATE ROLE oquiz WITH LOGIN PASSWORD 'oquiz';`

### Créer une base de données nommée "oquiz", dont le propriétaire est l'utilisateur "oquiz".

- puis créer l'utilisateur : `CREATE DATABASE oquiz OWNER oquiz;`

### Créer les tables grâce au fichier "import_tables.sql".

- `psql -U oquiz -f data/import_tables.sql`

### Importer les données grâce au fichier "import_data.sql".

- `psql -U oquiz -f data/import_data.sql`

On pourra ensuite se connecter à la BDD dans le code via l'url : `postgres://oquiz:oquiz@localhost/oquiz`

## Création du code

- Créer un dossier `app`, puis un sous-dossier `app/models`.

Dans ce dossier, on va coder des classes à partir du MCD du projet :

- une classe par entité: `Answer`, `Level`, `Question`, `Quiz`, `Tag`, et `User`
- une seule classe par fichier ! Le fichier porte le même nom que la classe, en minuscule.

Dans chaque classe :

- déclarer une propriété pour chaque champ de la table correspondante.
- coder un `constructor` qui prend en paramètre un objet. Cet objet contient toutes les valeurs à recopier dans l'instance.
- ne pas oublier d'exporter la classe !

## Do not repeat yourself

La propriété `id` est présente dans toutes les classes.

On va donc... les factoriser ! Et pour ce faire, on va utiliser l'héritage !

On va donc coder une class `CoreModel`, dans le même dossier que les autres, et toutes les classes vont _hériter_ de celle-ci :

- Penser à exporter `CoreModel`.
- Penser à require `CoreModel` dans les autres fichiers.
- Penser à appeler le "constructeur parent" dans les constructeur des classes.

## Get/Set

Dans chaque classe, à commencer par `CoreModel`, coder un "getter" et un "setter" par propriété en y ajouter les instruction voulues.

<details>
<summary>Un exemple </summary>

```JS
class CoreModel {
  id;

  get id() {
    return this.id;
  };

  set id(value) {
    this.id = value;
  };
};
```

</details>

## Ne pas autoriser de valeurs absurdes

Dans les "setters", rajouter des tests pour vérifier que la donnée passée en argument est au moins du bon type.

<details>
<summary>Un exemple</summary>

```js
class CoreModel {
  id;

  set id(value) {
    if(isNaN(parseInt(value, 10))) {
      throw Error("CoreModel.id must be a integer !");
      // on "lève" une erreur => ça arrête tout !
    }
    this.id = value;
  }
};
```

</details>

# Active Record

Les méthodes Active Record du modèle `Level` ont été codées.

On a pu vérifier que ces méthodes fonctionnent en jouant dans `test.js`.

En s'inspirant (très largement) de ce code existant, on passe à la suite, à savoir coder les méthodes Active Record du modèle `User` : 
- `findAll(callback)`, qui trouve tous les Users dans la base de données.
- `findById(id, callback)`, qui trouve un User en fonction de son ID.
- `insert(callback)`, qui insert l'instance courante dans la base de données.
- `update(callback)`, qui met à jour l'instance courante dans la base de données.
- `delete(callback)`, qui supprime l'instance courante de la base de données.

## Mise en place des routes pour la vue signup

- mise en place des routes
- définition de la logique dans le contrôleur userController
  - afficher le formulaire
  - traiter le formulaire :
    - vérifier si un utilisateur n'existe pas déjà avec cet email
    - vérifier que l'email est dans un format valide, vous pouvez utiliser le package [email-validator](https://www.npmjs.com/package/email-validator) pour ça
    - imposer un mot de passe d'une longueur minimum de 8 caractères
    - effectuer l'insertion en base de données en hashant le mot de passe
    - en cas d'erreur, réafficher le formulaire avec un message d'erreur et les champs saisis par l'utilisateur
    - en cas de succès, redigirez le flux vers la route /login

## Active Record factorisé

Les méthodes Active Record sont maintenant factorisé directement dans CoreModel

Commencer par vérifier que tout fonctionne en écrivant quelques tests dans `test.js`, par exemple : 
- Trouver tous les User.
- Trouver la question dont l'id est 3.
- Créer un Level avec le nom "très difficile" et l'insérer en BDD.
- ...

Ensuite, rajouter 2 méthodes dans CoreModel : 
- `findBy(params, callback)` qui trouve les modèles correspondants à tous les paramètres passées dans le premier argument.
<details>
<summary>Un exemple</summary>

```js
Level.findBy({name:"difficile"}, callback); // trouve le(s) level(s) dont le nom est "difficile"
User.findBy({email: "michel@oclock.io"}, callback); // trouve le(s) user(s) dont l'email est "michel@oclock.io"
Tag.findBy({
  name: "Histoire"
}, callback); // trouve le(s) tag(s) dont le name est "Histoire".

```
</details>

- `save(callback)` : cette méthode appelle soit `insert` soit `update`, selon que l'instance existe déjà dans la BDD ou pas.

### Mise en place de l'architecture express

- npm est votre ami : installer les dépendances nécessaires
- point d'entrée de l'application : `index.js` (on y fait les réglages habituels pour express)
- un router (dans `app`)
- un dossier controllers (dans `app`)
- un controller `mainController`
- on oublie pas les fichiers statiques (notamment le CSS)
- et plus si nécessaire...

### Page d'accueil

L'intégration est fournie !

Commencer par découper l'intégration en views façon EJS.
Pensez à supprimer les fichiers html, si vous définissez le repertoire `integration/` comme répertoire des statiques.
Sinon vous allez afficher par défaut le contenu du fichier `index.html` lors de l'appel à `http://localhost:xxxx/`

Ensuite, créer la route et la méthode correspondante dans le controller "mainController".

### Visualiser les titres, les sous-titres et les auteurs des quizzes sur la page d’accueil

Remplacer les fausses données "en dur" par les données issues des Models !

Ici, se servir de Sequelize est une bonne idée (cf [les associations](https://sequelize.org/master/manual/eager-loading.html)).

### Pouvoir accéder aux questions d’un quiz

Il va falloir une nouvelle route (`/quiz/:id`).

Coder la méthode correspondante dans un nouveau controlleur (`quizController`).

Ici aussi, Sequelize va être bien pratique...

1. pouvoir visualiser la difficulté de chaque question

2. visualiser tous les sujets rattachés au quiz

### pouvoir visualiser tous les sujets

Nouvelle route (`/tags`)

Nouveau controller (`tagController`)

### pouvoir visualiser tous les quizzes pour un sujet donné

Astuce : utiliser le model Tag, et se servir des "includes" de Sequelize pour en déduire les quizzes concernées !

### :v: Bonus facile : Ajouter tous les liens qui pourraent manqués

Il y a surement des endroits ou il serait intéressant de pouvoir cliquer, afin de rendre la navigation plus fluide.

### :skull_and_crossbones::clock4: Bonus de la mort où j'ai une semaine devant moi et je savais pas quoi faire : formulaires

Rajouter les formulaires d'inscription et de connexion.
Avec tout ce qui est nécessaire (Ajout en base de données, login en session plus ou moins longue)


