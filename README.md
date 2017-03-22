# Pepite-API Local:

## API endpoints list:
* **GET /**
** Api root endpoint**
    * Output exemple:
```
"welcome to Pepite API"
```
* **GET /users**
** API users endpoint**
    * Output exemple:
```
[{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},{"_id":"58caba32b0f0d870e464e589","firstname":"Ben","lastname":"Roullet","__v":0},{"_id":"58cb9f4314d81a0919acb2b0","firstname":"Romain","lastname":"Tête","__v":0}]
```
* **GET /user/:id**
** Api specific user endpoint**
    * Output exemple:
```
{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"}
```
* **POST /user**
** API for user creation
params:
-firstname:String
-lastname:String**
    * Output exemple:
```
{"success":true,"message":"Utilisateur enregistré"}
```
* **DELETE /user**
** API endpoint to delete user:
Params:
-id**
    * Output exemple:
```
{"success":true,"message":"Utilsateur supprimé"}
```
* **GET /phases**
** API endpoint for display phases**
    * Output exemple:
```
[{"_id":"58cbf51666828a4c94e5b48a","title":"Avoir un comportement entrepreneurial","__v":0,"categories":[]},{"_id":"58d240abd7c48775d6db32ca","title":"Faire émerger l'opportunité d'entreprendre","categories":[]},{"_id":"58d240c7d7c48775d6db32cb","title":"Construire le projet","categories":[]},{"_id":"58d240d9d7c48775d6db32cc","title":"Lancer le projet","categories":[]}]
```
* **GET /phase/:id/categories**
** API endpoint for getting phase's categories
params:
-id:String**
    * Output exemple:
```
[{"_id":"58cbef162cf6ff44cf7e52a4","title":"Être actif et autonome","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Faire preuve d'initiative","Être force de proposition","Impulser l'action","Porter ses propositions","Être autonome : capacité à décider de ses buts et de ses moyens"]},{"_id":"58cbef162cf6ff44cf7e52a5","title":"Travailler en équipe","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Travailler en équipe","Écouter les autres","Aller chercher des ressources et des compétences"]},{"_id":"58cbef162cf6ff44cf7e52a6","title":"Être curieux, écouter et explorer","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Capacité à apprendre","Capacité à se remettre en cause","Capacité à explorer, à sortir du cadre","Intelligence situationnelle"]},{"_id":"58cbef162cf6ff44cf7e52a7","title":"S'engager et accepter le risque","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Prendre des risques : oser, accepter et s'approprier le changement","Évaluer les risques","Se projeter dans l'inconnu","Surmonter les obstacles"]}]
```


### lancer le serveur: `node server.js`
** For automation README.md population file with postman collection:
* [Follow this link](http://git.skilvioo.net/team/api-doc-hook) to clone the pre-commit hooks in you `.git/hooks/` directory
* Make sure you have node installed and add postman-readme-populate.js at the root of your project
* Make sure you have only one postman collection in root `postman-collections` directory
* Change the collection and add it to a git commit and :tada:
