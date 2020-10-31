-- ------------------------------
-- Création des tables pour l'application oQuiz
-- ------------------------------

-- par convention, on nomme nos tables et nos champs au singulier, en anglais, en miniscule et en snake_case
-- bonne pratique : on va entourer tous ces noms de double quotes (") pour éviter toute confusion à PostgreSQL

-- ------------------------------

-- On va sécuriser notre script en effectuant une transaction :

-- BEGIN;
-- nos requêtes de création de tables
-- COMMIT;

-- Les requêtes vont être "prédigérées" par POstgreSQL avant d'être envoyées à la base
-- ainsi, en cas d'erreur, même à la dernier requête, la transaction entière va être annulée
-- pas de risque que le fichier soit partiellement exécuté, c'est tout ou rien

-- début de transaction
BEGIN;

-- avant de créer les tables, par sécurité, on les supprime
DROP TABLE IF EXISTS "level", "user", "quiz", "tag", "question", "answer", "quiz_has_tag";

-- on est sûr que la BDD est propre, on peut commencer la création

-- pour tous nos champs id, nos clé primaires, on va utiliser le type SERIAL
-- ce type est un pseudo-type, c'est en fait un INT NOT NULL relié à une table interne qui permet de l'incrémenter à chaque nouvel enregistrement
-- la 'vraie' syntaxe serait id INTEGER NOT NULL DEFAULT nextval('<table>_id_seq'::regclass)

-- ------------------------------
-- table level
-- ------------------------------

CREATE TABLE IF NOT EXISTS "level" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- ------------------------------
-- table user
-- ------------------------------

CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "age" INT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL

);

-- ------------------------------
-- table quiz
-- ------------------------------

CREATE TABLE IF NOT EXISTS "quiz" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creation_date" TIMESTAMP NOT NULL,
    -- on définit la clé étrangère directement à la création de la table avec REFERENCES <table>(<champ>)
    -- par convention, ce champ est nommé <table>_<champ>
    "user_id" INT NOT NULL REFERENCES "user"("id")
);

-- ------------------------------
-- table tag
-- ------------------------------

CREATE TABLE IF NOT EXISTS "tag" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- ------------------------------
-- table question
-- ------------------------------

-- on ne peut pas créer ici la référence vers la bonne réponse : la table 'answer' n'a pas encore été créée
-- on pourra ajouter cette info dans un 2ème temps, après la création de toutes les tables

CREATE TABLE IF NOT EXISTS "question" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "level_id" INT NOT NULL REFERENCES "level"("id"),
    "quiz_id" INT NOT NULL REFERENCES "quiz"("id"),
    "answer_id" INT NOT NULL
);

-- ------------------------------
-- table answer
-- ------------------------------

CREATE TABLE IF NOT EXISTS "answer" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "question_id" INT NOT NULL REFERENCES "question"("id")
);

-- ------------------------------
-- table quiz_has_tag
-- ------------------------------

CREATE TABLE IF NOT EXISTS "quiz_has_tag" (
    "quiz_id" INT NOT NULL REFERENCES "quiz"("id"),
    "tag_id" INT NOT NULL REFERENCES "tag"("id"),
    -- on ne peut pas utiliser le mot-9clé PRIMARY KEY sur plusieurs champs
    -- pour indiquer une clé primaire sur plusieurs champs, on la définit à part, après la définition de nos champs
    PRIMARY KEY ("quiz_id", "tag_id")
);

-- toutes les tables sont créées, on peut maintenant ajouter la clé étrangère manquante sur la table question
ALTER TABLE "question"
    ADD FOREIGN KEY ("answer_id") REFERENCES "answer"("id");


-- aucune erreur ne s'est produite, on envoie toutes les requêtes sur le serveur PostgreSQL
COMMIT;
