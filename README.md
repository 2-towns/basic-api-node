# Introduction 

Ce repository contient les fichiers pour l'article sur [codons.blog](https://codons.blog/creer-une-api-avec-node-js.html).

# Commandes 

Pour installer les dépendances:
```sh  
npm install
```

Pour démarrer le serveur en utilisant Javascript: 
```sh  
npm run start:js
```

Pour démarrer le serveur en en utilisant Typescript: 
```sh  
npm run start:ts 
```

Le script start.js utilise `esbuild` pour produire un fichier javascript depuis les fichiers typescript.

Le dossier test contient les fichiers utilisant [ain](https://github.com/jonaslu/ain).