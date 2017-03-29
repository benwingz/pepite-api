var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');


var config = require('../../config');
var User = require('../models/user.model');

var errorHandler = require('../service/error.service');
var passwordService = require('../service/password.service');


function generateToken(user) {
  var payload = {
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname
  }
  var newToken = jwt.sign(payload, config[process.env.ENV].secret, {
    expiresIn: 60*60*24*7 //expires in 7 days
  });

  return newToken;
}

function doCreateUser(firstname, lastname, email, password) {
  var newUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: passwordService.encryptPassword(password)
  });
  return newUser.save();
}

exports.authenticate = function(req, res){
  if(req.body.token) {
    var token = req.body.token;
    jwt.verify(token, config[process.env.ENV].secret, function(err, decoded) {
      if(err) {
        res.status(403).json({error: "Token invalid"});
      } else {
        var user = decoded;

        res.json({
          success: true,
          message: 'Authentification réuissite',
          token: generateToken(user)
        });
      }
    });
  } else {
    User.findOne({email: req.body.email}, function(err, user) {
      if(err) throw err;
      if(user) {

        if (passwordService.checkPassword(req.body.password, user)) {
          res.json({
            success: true,
            message: 'Authentification réuissite',
            token: generateToken(user)
          });
        } else {
          res.status(403).send({error: 'Mot de passe erroné'});
        }
      } else {
        doCreateUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password)
          .then((user) => {
            if (user) {
              res.json({
                success: true,
                message: 'Utilisateur enregistré',
                token: generateToken(user)
              });
            } else {
              errorHandler.error(res, "L'utilisateur n'a pas pu être créé");
            }
          })
      }
    })
  }
}

exports.getAllUser = function(req, res){
  User.find().then(
    function(users) {
      res.json(users);
    },
    function(error){
      errorHandler.error(res, "Aucuns utilisateur trouvé");
    })
};

exports.findOneById = function(req, res){
  User.findById(req.params.id ,function(err, user) {
      if (err) {
        errorHandler.error(res, 'Impossible de trouver cet utilisateur.');
      } else {
        res.json(user);
      }
    }
  );
};

exports.createUser = function(req, res) {
  if(!req.body.firstname || !req.body.lastname || !req.body.email) {
    errorHandler.error(res, "Il manque un paramètre pour compléter la creation de l'utilisateur");
  } else {
    User.findOne({email: req.body.email}, function(err, user){
      if (user) {
        errorHandler.error(res, 'Un utilisateur similaire existe déjà');
      } else {
        doCreateUser(req.body.firstname, req.body.lastname, req.body.email)
          .then((user) => {
            if (user) {
              res.json({ success: true, message: 'Utilisateur enregistré'});
            } else {
              errorHandler.error(res, "L'utilisateur n'a pas pu être créé");
            }
          });
      }
    });
  }
};

exports.deleteUser = function(req, res) {
  User.deleteOne({ _id: req.body.id }, function(err) {
    if (err) {
      errorHandler.error(res, "Impossible de supprimer cet utilisateur");
    } else {
      res.json({success: true, message: "Utilsateur supprimé"});
    }

  })
};
