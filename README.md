# Pepite-API Local:

## API endpoints list:
* **GET /**
  * **Api root endpoint**
  * Output exemple:
```
"welcome to Pepite API"
```

* **GET /users**
  * **API users endpoint**
  * Output exemple:
```
[{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},{"_id":"58caba32b0f0d870e464e589","firstname":"Ben","lastname":"Roullet","__v":0},{"_id":"58cb9f4314d81a0919acb2b0","firstname":"Romain","lastname":"Tête","__v":0}]
```

* **GET /user/:id**
  * **Api specific user endpoint**
  * Output exemple:
```
{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"}
```

* **POST /user**
  * **API for user creation
params:
-firstname:String
-lastname:String**
  * **Parmeters requested:**
    * key: firstname:text
    * example: newuser
    * key: lastname:text
    * example: newuser
  * Output exemple:
```
{"success":true,"message":"Utilisateur enregistré"}
```

* **DELETE /user**
  * **API endpoint to delete user:
Params:
-id**
  * Output exemple:
```
{"success":true,"message":"Utilsateur supprimé"}
```

* **GET /phases**
  * **API endpoint for display phases **
  * Output exemple:
```
[{"_id":"58cbf51666828a4c94e5b48a","title":"Avoir un comportement entrepreneurial","__v":0,"categories":[]}]
```

* **GET /phase/:id/categories**
  * **API endpoint for getting phase's categories
params:
-id:String**
  * Output exemple:
```
[{"_id":"58cbef162cf6ff44cf7e52a4","title":"Être actif et autonome","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":[]},{"_id":"58cbef162cf6ff44cf7e52a5","title":"Travailler en équipe","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":[]},{"_id":"58cbef162cf6ff44cf7e52a6","title":"Être curieux, écouter et explorer","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":[]},{"_id":"58cbef162cf6ff44cf7e52a7","title":"S'engager et accepter le risque","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":[]}]
```

* **GET /grades**
  * **Get all grades**
  * Output exemple:
```
[{"_id":"58d285ea81c13b14abe4d325","_category":{"_id":"58cbef162cf6ff44cf7e52a4","title":"Être actif et autonome","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Faire preuve d'initiative","Être force de proposition","Impulser l'action","Porter ses propositions","Être autonome : capacité à décider de ses buts et de ses moyens"]},"_user":{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},"__v":0,"comments":[],"user_eval":{"value":5,"date":"2017-03-22T14:10:50.475Z"}},{"_id":"58d2861681c13b14abe4d326","_category":{"_id":"58cbef162cf6ff44cf7e52a5","title":"Travailler en équipe","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Travailler en équipe","Écouter les autres","Aller chercher des ressources et des compétences"]},"_user":{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},"__v":0,"comments":[],"user_eval":{"value":4,"date":"2017-03-22T14:11:34.318Z"}}]
```

* **GET /grade/:id**
  * **Get a specific grade**
  * Output exemple:
```
{"_id":"58d2861681c13b14abe4d326","_category":{"_id":"58cbef162cf6ff44cf7e52a5","title":"Travailler en équipe","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Travailler en équipe","Écouter les autres","Aller chercher des ressources et des compétences"]},"_user":{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},"__v":0,"comments":[],"user_eval":{"value":4,"date":"2017-03-22T14:11:34.318Z"}}
```

* **POST /grade**
  * **Add a grade**
  * **Parmeters requested:**
    * key: user:text
    * example: 58ca9645304609075babf8e4
    * key: category:text
    * example: 58cbef162cf6ff44cf7e52a5
    * key: value:text
    * example: 4
  * Output exemple:
```
{"success":true,"message":"Évaluation enregistré"}
```

* **DELETE /grade**
  * **Delete a specific grade**
  * Output exemple:
```
{"success":true,"message":"Évaluation supprimé"}
```

* **GET /comments**
  * **Get all comments**
  * Output exemple:
```
{"success":false,"message":"Aucuns commentaires"}
```

* **GET /comment/:id**
  * **Get a specific comment**

* **POST /comment**
  * **Add comment to a grade**
  * **Parmeters requested:**
    * key: grade:text
    * example: 58d285ea81c13b14abe4d325
    * key: user:text
    * example: 58caba32b0f0d870e464e589
    * key: content:text
    * example: Hey this is an  awesome comment
  * Output exemple:
```
{"success":true,"message":"Commentaire ajouté"}
```

* **GET /grade/:id/comments**
  * **Get all comments on a specific grade**
  * Output exemple:
```
[{"_id":"58d28dd25d3efc1b48e3d9ee","_grade":"58d285ea81c13b14abe4d325","_user":{"_id":"58caba32b0f0d870e464e589","firstname":"Ben","lastname":"Roullet","__v":0},"content":"Hey this is an  awesome comment","date":"2017-03-22T14:44:34.929Z","__v":0},{"_id":"58d28eb9d7dd821b8490dc4c","_grade":"58d285ea81c13b14abe4d325","_user":{"_id":"58cb9f4314d81a0919acb2b0","firstname":"Romain","lastname":"Tête","__v":0},"content":"Hey cool down dude","date":"2017-03-22T14:48:25.303Z","__v":0}]
```



### lancer le serveur: `node server.js`
**For automation README.md population file with postman collection:**
* [Follow this link](http://git.skilvioo.net/team/api-doc-hook) to clone the pre-commit hooks in your `.git/hooks/` directory
* Make sure you have node installed and add postman-readme-populate.js at the root of your project
* Make sure you have only one postman collection in root `postman-collections` directory
* Change the collection and add it to a git commit and :tada:
