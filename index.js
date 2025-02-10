//IMPORTATIONS DES LIBRAIRIES
const express = require("express"); //serveur express au lieu de http comme dans le cours 01
//librairie dotenv sur npm
const dotenv = require("dotenv");
// les urls sont compliquées car d'un systeme à l'autre (linux, window, mac) les barres obliques peuvent etre dans un sens ou dans l'autre /\
//on a donc besoin d'un module qui appartient à node.js (path)
const path = require("path");
const db = require("./config/db")
//DEMARRER LES VARIABLES D'ENVIRONNEMENT
const serveur = express(); //variable serveur contient des méthodes (POST, GET, etc.)
dotenv.config();

//PERMETTRE L'ACCES AU DOSSIER
//on pourrait ajouter d'autres dossier, exemple repertoire image pour le téléchargement pour une photo de profil
//Permettre au serveur d'accéder au dossier public pour pouvoir gérer les images, css et js automatiquement
const dossierPublic = path.join(__dirname, "public"); // on joint le dossier ds lequel on est et le chemin public
//avant de regarder les routes, vérifie ds le dossier public et s'il y en a, utilise les sans problèmes. L'ordre est important, mettre ceci avant les routes
serveur.use(express.static(dossierPublic));

//Méthode de la variable serveur
// serveur.get(); pour récupérer des données
// serveur.post(); pour envoyer des données
// serveur.put(); pour modifier des données
// serveur.delete(); pour supprimer des données

// ==========================================
//parametre de la requête et la réponse
// serveur.get('/', (req, res)=>{
//dans le cas d'une api, on retourne des données au format json et non une page web
// const reponse = {
// msg: 'Tiguidou',
// };
//Mime type (voir sur mdn pour toutes les possibilités)
// res.header('content-type', 'application/json')//non obligatoire dans ce cas, puisque res.json informe que c'est du json, mais sinon il est important de le mettre pour que la réponse soit envoyé dans le bon format
// res.statusCode = 200; //le statut code 200 est la valeur par défaut
// res.json(reponse);

//autre exemple au lieu de fichier json
// res.header("content-type", "text/html");
// res.statusCode = 400;
// res.send(reponse);
// });
// =============================

//Middleware. Doit avoir le parametre next sauf la dernière. Pourrait être une route admin pour vérifier si l'utilisateur est admin. Route pour un role en particulier ou si on est déconnecté, on ne peut pas accéder à certaines routes
function authentifier(req, res, next) {
  console.log("Authentification en cours");
  next();
}
//on pourrait écrire api, mais non obligatoire dans ce cas-ci. Si on aurait tout le mvc ensemble, on distinguerait les vues des pages des vues de données en utilisant /api/

// FAIRE LA DOCUMENTION DE CHAQUE ROUTE POUR LE TP
/**
 * Route servant à récupérer tous les films de la base de données
 */
serveur.get("/films", authentifier, async (req, res) => {
  try{
      const films = [];

  const docRefs = await db.collection("films").get();

  docRefs.forEach((doc) => {
    // const film = doc.data();
    const film = {id:doc.id, ...doc.data()}; //Récupère toutes les données de film, en plus du id. ...doc.data() équivaut à doc.titre, doc.annee, etc

    films.push(film);
  });
  if(films.length == 0 ){
    return res.status(404).json({msg: "Aucun film trouvé."});
  }
  return res.json(films); //important de faire un return pour arrêter l'execution de la fonction dès qu'on trouve qqch
  }catch(erreur){
    return res.status(500).json({ msg: "Une erreur est survenue" });

  }
});

/**
 * Route servant à récupérer un film de la base de données
 */
//:id est un parametre dynamique qui changera
serveur.get("/films/:id", (req, res) => {
  return res.json({ msg: "films id" });
});
serveur.post("/films", (req, res) => {
  return res.json({ msg: "films post" });
});


/**
 * Route pour initialiser la base de données, l'ordre est important. Mettre les routes avec le moins de paramètre en premier
 */
//ici on appele la function 'middleware' pour vérifier l'authentification
//TOUTES LES ROUTES DOIVENT AVOIR UN TRY CATCH
serveur.post("/films/initialiser", (req, res) => {
  try{
      const films = require("./data/filmsDepart");
      //TODO: Vérifier si le film est déjà dans la base de données

      films.forEach(async (film) => {
        await db.collection("films").add(film);
      });
      return res.status(201).json({ msg: "Base de données initialisée" });
  }catch(erreur){
      return res.status(500).json({ msg: "Une erreur est survenue" });

  }
});

/**
 * Route servant à modifier un film de la base de données
 */
serveur.put("/films/:id", (req, res) => {
  return res.json({ msg: "films put" });
}); //pour modifier un film, on ajoute :id

/**
 * Route servant à supprimer un film de la base de données
 */
serveur.delete("/films/:id", (req, res) => {
  return res.json({ msg: "films delete" });
}); //on veut seulement supprimer un film à la fois, donc on utilise :id

//RESSOURCES 404 (middleware)
//capte toutes les erreurs potentielles pour les url non prévues, mais dans l'inspecteur->reseau, il n'y a pas de code d'erreur 404, il est à 200, il faut donc ajouter .status(404) ou res.statusCode = 404;
serveur.use((req, res) => {
  // res.statusCode = 404;
  return res.status(404).json({ msg: "Ressources non trouvée" });
});

//node utilise généralement les port 3000 à 3500
serveur.listen(process.env.PORT, () => {
  console.log(`Le serveur est démarré sur le port ${process.env.PORT}`);
});

// ==============================================
// npm run dev pour démarrer le serveur
// s'assurer que express est bien installé dans le fichier package.json
// sinon npm install express
