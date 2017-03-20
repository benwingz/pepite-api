# Pepite-API Local:

## API endpoints list:
* **GET /**
    * Output exemple:
>>>
```
"welcome to Pepite API"
```
>>>
* **GET /users**
    * Output exemple:
>>>
```
[{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"},{"_id":"58caba32b0f0d870e464e589","firstname":"Ben","lastname":"Roullet","__v":0},{"_id":"58cb9f4314d81a0919acb2b0","firstname":"Romain","lastname":"Tête","__v":0}]
```
>>>
* **GET /user/:id**
    * Output exemple:
>>>
```
{"_id":"58ca9645304609075babf8e4","lastname":"Blanc","firstname":"Nicolas","_comment":"virgin student for auto-eval scenario"}
```
>>>
* **POST /user**
    * Output exemple:
>>>
```
{"success":true,"message":"Utilisateur enregistré"}
```
>>>
* **DELETE /user**
* **GET /phases**
* **GET /phase/:id/categories**
