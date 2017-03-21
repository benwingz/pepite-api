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
[{"_id":"58cbf51666828a4c94e5b48a","title":"Avoir un comportement entrepreneurial","__v":0,"categories":[]}]
```
* **GET /phase/:id/categories**
** API endpoint for getting phase categories
params:
-id:String**
    * Output exemple:
```
[{"_id":"58cbef162cf6ff44cf7e52a4","title":"Être actif et autonome","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":[]},{"_id":"58cbef162cf6ff44cf7e52a5","title":"Travailler en équipe","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":[]},{"_id":"58cbef162cf6ff44cf7e52a6","title":"Être curieux, écouter et explorer","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":[]},{"_id":"58cbef162cf6ff44cf7e52a7","title":"S'engager et accepter le risque","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":[]}]
```


### lancer le serveur: `node server.js`
