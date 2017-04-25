var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');


var config = require('../../config');
var User = require('../models/user.model');

var errorHandler = require('../service/error.service');
var passwordService = require('../service/password.service');
var authRequest = require('../service/authrequest.service');
var queryBuilder = require('../service/queryBuilder.service');


function generateToken(user) {
  var payload = {
    _id: user._id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    type: user.type,
    _validator: user._validator,
    _pepite: user._pepite
  }
  var newToken = jwt.sign(payload, config[process.env.ENV].secret, {
    expiresIn: 60*60*24*7 //expires in 7 days
  });

  return newToken;
}

function doCreateUser(firstname, lastname, email, password, type) {
  var newUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    type: (type) ? type : 'user'
  });
  passwordService.setUserPassword(newUser, password);
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
          token: generateToken(user),
          user_id: user._id
        });
      }
    });
  } else {
    User.findOne({email: req.body.email}, function(err, user) {
      if (err) throw err;
      if (user) {
        if (passwordService.checkPassword(user, req.body.password)) {
          res.json({
            success: true,
            message: 'Authentification réuissite',
            token: generateToken(user),
            user_id: user._id
          });
        } else {
          res.status(401).send({error: 'Mot de passe invalide'});
        }
      } else {
        if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.type) {
          errorHandler.error(res, "Ce compte n'existe pas");
        } else {
          doCreateUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password, req.body.type)
            .then((user) => {
              if (user) {
                res.json({
                  success: true,
                  message: 'Utilisateur enregistré',
                  token: generateToken(user),
                  user_id: user._id
                });
              } else {
                errorHandler.error(res, "L'utilisateur n'a pas pu être créé");
              }
            });
        }
      }
    })
  }
}

var responseUsers = function(users, res) {
  if(users.length > 0) {
    res.json(users);
  } else {
    errorHandler.error(res, 'Aucuns utilisateurs présent');
  }
}

exports.getAllUser = function(req, res){
  var user = authRequest.returnUser(req);
  switch (user.type) {
    case 'admin':
      queryBuilder.buildQueryFind(User,
        {find: {},
        select: '-password -salt'})
        .then(
          function(users) {
            responseUsers(users, res);
          },
          function(error) {
            errorHandler.error(res, 'Impossible de récuperer les utilisateurs');
          }
        );
      break;
    case 'pepite-admin':
      queryBuilder.buildQueryFind(User,{
        find: {_pepite: user._pepite},
        select: '-password -salt'})
        .then(
          function(users) {
            responseUsers(users, res);
          },
          function(error) {
            errorHandler.error(res, 'Impossible de récuperer les utilisateurs');
          }
        );
      break;
    case 'validator':
      queryBuilder.buildQueryFind(User,{
        find: {_validator: user._id},
        select: '-password -salt -type'})
        .then(
          function(users) {
            responseUsers(users, res);
          },
          function(error) {
            errorHandler.error(res, 'Impossible de récuperer les utilisateurs');
          }
        );
      break;
    default:
      errorHandler.error(res, 'Impossible de récuperer les utilisateurs');
  }
};

exports.findUserById = function(req, res){
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
  var user = authRequest.returnUser(req);
  if (['admin', 'pepite-admin'].indexOf(user.type) != -1) {
    if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.type) {
      errorHandler.error(res, "Il manque un paramètre pour compléter la creation de l'utilisateur");
    } else {
      User.findOne({email: req.body.email}, function(err, user){
        if (user) {
          errorHandler.error(res, 'Un utilisateur similaire existe déjà');
        } else {
          doCreateUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password)
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
  } else {
    errorHandler.error(res, 'Impossible de modifier cet utilisateur');
  }
};

exports.deleteUser = function(req, res) {
  var user = authRequest.returnUser(req);
  if (['admin', 'pepite-admin'].indexOf(user.type) != -1) {
    User.deleteOne({ _id: req.body.id }, function(err) {
      if (err) {
        errorHandler.error(res, "Impossible de supprimer cet utilisateur");
      } else {
        res.json({success: true, message: "Utilsateur supprimé"});
      }

    });
  } else {
    errorHandler.error(res, 'Impossible de modifier cet utilisateur');
  }
};

exports.patchUser = function(req, res) {
  var user = authRequest.returnUser(req);
  if (['admin', 'pepite-admin'].indexOf(user.type) != -1 || user._id == req.body.id) {
    if(req.body.password) {
      passwordService.setUserPassword(req.body, req.body.password);
    }
    User.update({_id: req.body.id}, req.body, function(err, raw) {
      if(err) {
        errorHandler.error(res, 'Impossible de modifier cet utilisateur');
      } else {
        res.json(raw);
      }

    })
  } else {
    errorHandler.error(res, 'Impossible de modifier cet utilisateur');
  }
};
