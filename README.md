# Pepite-API Local:

## API endpoints list:
* **GET /**
  * Description: API root endpoint
  * Output exemple:
```
"welcome to Pepite API"
```

* **POST authenticate/**
  * Description: API endpoint to autheticate
  * Parmeters requested:
```
-email:text (example: jules.vernes@skilvioo.com)```
```
-firstname:text (example: Jules)```
```
-lastname:text (example: Vernes)```
```
-password:text (example: 20000lieux)```
  * Output exemple:
```
{"success":true,"message":"Authentification réuissite","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiX192IjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsImxhc3RuYW1lIjoiaW5pdCIsImZpcnN0bmFtZSI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJlbWFpbCI6dHJ1ZSwibGFzdG5hbWUiOnRydWUsImZpcnN0bmFtZSI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwicGFzc3dvcmQiOiIxODFkM2RjMzM1MzZhNGFhNDMzMWVkMTIwNWZhYTIyZTQyN2E0MGE5YmQzMDIxNzQ1ODU3YWUzZjA0YWQ2YTBjNzMwZTBkNTU3MzFmODJmNDEwN2IyMjFmN2JiN2U3ZmVkZjBlMzYwMTI5NGE3YjlmZjQ4MTdhNGUyZWNkZWI1OSIsImVtYWlsIjoianVsZXMudmVybmVzQHNraWx2aW9vLmNvbSIsImxhc3RuYW1lIjoiVmVybmVzIiwiZmlyc3RuYW1lIjoiSnVsZXMiLCJfaWQiOiI1OGRiYzUxYjI3N2JhZjI1NzRlYTkxNmMifSwiaWF0IjoxNDkwNzk3ODY5LCJleHAiOjE0OTE0MDI2Njl9.rW2BCHVldl6NTtOPfyWpkqoc-oC_rhltyaxP9g4h4CE"}
```

* **GET /users**
  * Description: API users endpoint
  * Output exemple:
```
[{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},{"_id":"58caba32b0f0d870e464e589","firstname":"Ben","lastname":"Roullet","__v":0},{"_id":"58cb9f4314d81a0919acb2b0","firstname":"Romain","lastname":"Tête","__v":0}]
```

* **GET /user/:id**
  * Description: API specific user endpoint
  * Output exemple:
```
{"_id":"58dbc5c5277baf2574ea916d","firstname":"ben","lastname":"roullet","email":"ben.rou@skilvioo.com","password":"31eab866d9cad84ea20e7a66f009af939c8476d88a93d25fbdb44e3f08a433cf2cb91a40c1a10199c1f36a51e8da7f2d15cfeb2b82219a59088a9856965f7769","__v":0}
```

* **POST /user**
  * Description: API endpoint to add user
  * Parmeters requested:
```
-firstname:text (example: newuser)```
```
-lastname:text (example: newuser)```
```
-email:text (example: new@email.com)```
  * Output exemple:
```
{"success":true,"message":"Utilisateur enregistré"}
```

* **DELETE /user**
  * Description: API endpoint to delete user:
  * Parmeters requested:
```
-id:text (example: 58dbaa37b0787c1152dcfb14)```
  * Output exemple:
```
{"success":true,"message":"Utilsateur supprimé"}
```

* **GET /phases**
  * Description: API endpoint for display phases 
  * Output exemple:
```
[{"_id":"58cbf51666828a4c94e5b48a","title":"Avoir un comportement entrepreneurial","__v":0,"categories":[]}]
```

* **GET /phase/:id/categories**
  * Description: API endpoint for getting phase's categories
  * Output exemple:
```
[{"_id":"58cbef162cf6ff44cf7e52a4","title":"Être actif et autonome","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Faire preuve d'initiative","Être force de proposition","Impulser l'action","Porter ses propositions","Être autonome : capacité à décider de ses buts et de ses moyens"]},{"_id":"58cbef162cf6ff44cf7e52a5","title":"Travailler en équipe","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Travailler en équipe","Écouter les autres","Aller chercher des ressources et des compétences"]},{"_id":"58cbef162cf6ff44cf7e52a6","title":"Être curieux, écouter et explorer","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Capacité à apprendre","Capacité à se remettre en cause","Capacité à explorer, à sortir du cadre","Intelligence situationnelle"]},{"_id":"58cbef162cf6ff44cf7e52a7","title":"S'engager et accepter le risque","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Prendre des risques : oser, accepter et s'approprier le changement","Évaluer les risques","Se projeter dans l'inconnu","Surmonter les obstacles"]}]
```

* **GET /grades**
  * Description: API endpoint for retrieve all grades
  * Output exemple:
```
[{"_id":"58d285ea81c13b14abe4d325","_category":{"_id":"58cbef162cf6ff44cf7e52a4","title":"Être actif et autonome","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Faire preuve d'initiative","Être force de proposition","Impulser l'action","Porter ses propositions","Être autonome : capacité à décider de ses buts et de ses moyens"]},"_user":{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},"__v":0,"comments":[],"user_eval":{"value":5,"date":"2017-03-22T14:10:50.475Z"}},{"_id":"58d2861681c13b14abe4d326","_category":{"_id":"58cbef162cf6ff44cf7e52a5","title":"Travailler en équipe","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Travailler en équipe","Écouter les autres","Aller chercher des ressources et des compétences"]},"_user":{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},"__v":0,"comments":[],"user_eval":{"value":4,"date":"2017-03-22T14:11:34.318Z"}}]
```

* **GET user/:id/grades**
  * Description: API endpoint to get grades of user
  * Output exemple:
```
[{"_id":"58d285ea81c13b14abe4d325","_category":"58cbef162cf6ff44cf7e52a4","_user":{"_id":"58dbc5c5277baf2574ea916d","firstname":"ben","lastname":"roullet","email":"ben.rou@skilvioo.com","password":"31eab866d9cad84ea20e7a66f009af939c8476d88a93d25fbdb44e3f08a433cf2cb91a40c1a10199c1f36a51e8da7f2d15cfeb2b82219a59088a9856965f7769","__v":0},"__v":0,"_validator":null,"validator_eval":{"value":1,"date":"2017-03-29T12:40:14.613Z"},"user_eval":{"value":3,"date":"2017-03-29T12:40:14.613Z"}},{"_id":"58d2861681c13b14abe4d326","_category":"58cbef162cf6ff44cf7e52a5","_user":{"_id":"58dbc5c5277baf2574ea916d","firstname":"ben","lastname":"roullet","email":"ben.rou@skilvioo.com","password":"31eab866d9cad84ea20e7a66f009af939c8476d88a93d25fbdb44e3f08a433cf2cb91a40c1a10199c1f36a51e8da7f2d15cfeb2b82219a59088a9856965f7769","__v":0},"__v":0,"user_eval":{"value":4,"date":"2017-03-22T14:11:34.318Z"}}]
```

* **GET /grade/:id**
  * Description: Get a specific grade
  * Output exemple:
```
{"_id":"58d2861681c13b14abe4d326","_category":{"_id":"58cbef162cf6ff44cf7e52a5","title":"Travailler en équipe","_phase":"58cbf51666828a4c94e5b48a","__v":0,"skills":["Travailler en équipe","Écouter les autres","Aller chercher des ressources et des compétences"]},"_user":{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},"__v":0,"comments":[],"user_eval":{"value":4,"date":"2017-03-22T14:11:34.318Z"}}
```

* **POST /grade**
  * Description: API endpoint to add a grade
  * Parmeters requested:
```
-user:text (example: 58ca9645304609075babf8e4)```
```
-category:text (example: 58cbef162cf6ff44cf7e52a5)```
```
-value:text (example: 4)```
  * Output exemple:
```
{"success":true,"message":"Évaluation enregistré"}
```

* **DELETE /grade**
  * Description: API endpoint to delete a specific grade
  * Parmeters requested:
```
-id:text (example: 58d2827f908bc013ff916fa7)```
  * Output exemple:
```
{"success":true,"message":"Évaluation supprimé"}
```

* **PATCH /grade**
  * Description: API endpoint to update grade
  * Parmeters requested:
```
-id:text (example: 58d285ea81c13b14abe4d325)```
```
-user_eval.value:text (example: 3)```
```
-validator_eval.value:text (example: 1)```
```
-_validator:text (example: 58caba32b0f0d870e464e589)```
  * Output exemple:
```
{"n":1,"nModified":1,"ok":1}
```

* **GET /category/:id/grades**
  * Description: API endpoint to retrieve grades by category
  * Output exemple:
```
[{"_id":"58d285ea81c13b14abe4d325","_category":"58cbef162cf6ff44cf7e52a4","_user":{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},"__v":0,"user_eval":{"value":5,"date":"2017-03-22T14:10:50.475Z"}}]
```

* **GET /comments**
  * Description: API endpoint for retrieve all comments 
  * Output exemple:
```
[{"_id":"58d28dd25d3efc1b48e3d9ee","_grade":"58d285ea81c13b14abe4d325","_user":{"_id":"58caba32b0f0d870e464e589","firstname":"Ben","lastname":"Roullet","__v":0},"content":"Hey this is an  awesome comment","date":"2017-03-22T14:44:34.929Z","__v":0}]
```

* **GET /comment/:id**
  * Description: Get a specific comment

* **POST /comment**
  * Description: APi endpoint to add comment on a grade
  * Parmeters requested:
```
-grade:text (example: 58d285ea81c13b14abe4d325)```
```
-user:text (example: 58caba32b0f0d870e464e589)```
```
-content:text (example: Hey this is an  awesome comment)```
  * Output exemple:
```
{"success":true,"message":"Commentaire ajouté"}
```

* **GET /grade/:id/comments**
  * Description: API endpoint to get all comments on a specific grade
  * Output exemple:
```
[{"_id":"58d28dd25d3efc1b48e3d9ee","_grade":"58d285ea81c13b14abe4d325","_user":{"_id":"58dbc5c5277baf2574ea916d","firstname":"ben","lastname":"roullet","email":"ben.rou@skilvioo.com","password":"31eab866d9cad84ea20e7a66f009af939c8476d88a93d25fbdb44e3f08a433cf2cb91a40c1a10199c1f36a51e8da7f2d15cfeb2b82219a59088a9856965f7769","__v":0},"content":"J'ai un tatouage à plusieurs dimensions !!!","date":"2017-03-29T12:43:25.689Z","__v":0}]
```

* **DELETE /comment**
  * Description: API endpoint to delete comment
  * Parmeters requested:
```
-id:text (example: 58d28eb9d7dd821b8490dc4c)```
  * Output exemple:
```
{"success":true,"message":"Commentaire supprimée"}
```

* **PATCH /comment**
  * Description: API endpoint to update comment
  * Parmeters requested:
```
-id:text (example: 58d28dd25d3efc1b48e3d9ee)```
```
-content:text (example: J'ai un tatouage à plusieurs dimensions !!!)```
  * Output exemple:
```
{"n":1,"nModified":1,"ok":1}
```



### lancer le serveur: `node server.js`
**For automation README.md population file with postman collection:**
* [Follow this link](http://git.skilvioo.net/team/api-doc-hook) to clone the pre-commit hooks in your `.git/hooks/` directory
* Make sure you have node installed and add postman-readme-populate.js at the root of your project
* Make sure you have only one postman collection in root `postman-collections` directory
* Change the collection and add it to a git commit and :tada:
