var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');


var config = require('../../config');
var User = require('../models/user.model');
var Account = require('../models/account.model');
var Reset = require('../models/reset.model');

var errorHandler = require('../service/error.service');
var passwordService = require('../service/password.service');
var authRequest = require('../service/authrequest.service');
var queryBuilder = require('../service/queryBuilder.service');
var mailer = require('../service/mailer.service');


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

function doCreateUser(userInfo) {
  var newUser = new User({
    email: userInfo.email,
    type: (userInfo.type) ? userInfo.type : 'user',
    firstname: (userInfo.firstname) ? userInfo.firstname: '',
    lastname: (userInfo.lastname) ? userInfo.lastname: '',
    _pepite: (userInfo._pepite) ? userInfo._pepite: null,
    created_at: moment().format(),
    updated_at: moment().format()
  });
  if (userInfo.password) passwordService.setUserPassword(newUser, userInfo.password);
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
        User.findOne({_id: user._id}, function(err, user) {
          if(user) {
            user.last_login_at = moment();
            console.log('user',user);
            User.update({_id: user._id}, user, function(err, raw) {
              if (err) {
                console.log(err);
              }
            });
          }
        });
        res.json({
          success: true,
          message: 'Authentification réuissite',
          token: generateToken(user),
          user_id: user._id
        });
      }
    });
  } else {
    User.findOne({$or: [
      {email: req.body.email},
      {otheremail: req.body.email}
    ]}, function(err, user) {
      if (err) throw err;
      if (user) {
        user.last_login_at = moment();
        User.update({_id: user._id}, user, function(err, raw) {
          if (err) {
            console.log(err);
          }
        });
        if (passwordService.checkPassword(user, req.body.password)) {
          res.json({
            success: true,
            message: 'Authentification réuissie',
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
          doCreateUser({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type
          }).then((user) => {
              user.created_at = moment();
              user.updated_at = moment();
              user.last_login_at = moment();
              User.update({_id: user._id}, user, function(err, raw) {
                if (err) {
                  console.log(err);
                }
              });
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
    errorHandler.error(res, 'Aucun utilisateur présent');
  }
}

exports.getAllUser = function(req, res){
  var user = authRequest.returnUser(req);
  switch (user.type) {
    case 'admin':
      var query;
      if(req.query.pepite) {
        query = queryBuilder.buildQueryFind(User,
            {find: {_pepite: req.query.pepite},
            select: '-password -salt',
            sort: 'type'})
      } else {
        query = queryBuilder.buildQueryFind(User,
          {find: {},
          select: '-password -salt',
          sort: 'type'})
      }
      query.then(
        function(users) {
          responseUsers(users, res);
        },
        function(error) {
          errorHandler.error(res, 'Impossible de récuperer les utilisateurs');
        }
      );
      break;
    case 'pepite-admin':
      var query;
      if (req.query.user) {
        query = queryBuilder.buildQueryFind(User,{
          find: {_validator: req.query.user},
          select: '-password -salt'})
      } else {
        query = queryBuilder.buildQueryFind(User,{
          find: {_pepite: user._pepite},
          populate: [{field: '_validator', filter:'-password -salt'}],
          select: '-password -salt',
          sort: '-type'})
      }
      query.then(
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
    if(!req.body.email || !req.body.type) {
      errorHandler.error(res, "Il manque un paramètre pour compléter la creation de l'utilisateur");
    } else if(!req.body.firstname) {
      User.findOne({email: req.body.email}, function(err, user){
        if (user) {
          errorHandler.error(res, 'Un utilisateur similaire existe déjà');
        } else {
          doCreateUser({
            email: req.body.email,
            type: req.body.type,
            _pepite: req.body.pepite
          }).then((user) => {
              if (user.firstname == '') {
                var newAccountToken = new Account({
                  _user: user._id
                });
                newAccountToken.save(function(err, token) {
                  if(!err) {
                    mailer.mailtoActivate(user, 'Activez votre compte pépite', token._id);
                  }
                });
              }
              if (user) {
                res.json({ success: true, message: 'Utilisateur enregistré'});
              } else {
                errorHandler.error(res, "L'utilisateur n'a pas pu être créé");
              }
            });
        }
      });
    } else {
      doCreateUser({
        email:req.body.email,
        type: req.body.type,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        _pepite: req.body._pepite,
        password: req.body.password
      }).then((user) => {
        if (user) {
          res.json({ success: true, message: 'Utilisateur enregistré'});
        } else {
          errorHandler.error(res, "L'utilisateur n'a pas pu être créé");
        }
      })
    }
  } else {
    errorHandler.error(res, 'Impossible de créer cet utilisateur');
  }
};

exports.deleteUser = function(req, res) {
  var user = authRequest.returnUser(req);
  if (['admin', 'pepite-admin'].indexOf(user.type) != -1) {
    User.deleteOne({ _id: req.params.id }, function(err) {
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
    req.body.updated_at = moment();
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

exports.getUserToActivate = function(req, res) {
  Account.findById(req.params.id).populate('_user').then((account) => {
    if (account) {
      res.json(account._user);
    } else {
      errorHandler.error(res, "Impossible d'activer cet utilisateur");
    }
  })
}

exports.activateUser = function(req, res) {
  User.findOne({email: req.body.email}).then((user) => {
    if (!user.password && req.body.password) passwordService.setUserPassword(user, req.body.password);
    req.body.password = user.password;
    req.body.salt = user.salt;
    var accoundId = req.body.activationAccountId;
    if (moment(req.body.birthdate, 'DD/MM/YYYY').isValid()) {
      req.body.birthdate = moment(req.body.birthdate, 'DD/MM/YYYY');
    } else {
      req.body.birthdate = moment(req.body.birthdate);
    }
    req.body.updated_at = moment();
    delete req.body.activationAccountId;
    User.update({_id: user._id}, req.body, function(err, raw) {
      if(err) {
        errorHandler.error(res, 'Impossible de modifier cet utilisateur');
      } else {
        Account.deleteOne({_id: accoundId}, function(err) {
          (err) ? res.json(err) : res.json(raw);
        });
      }
    });
  })
}

exports.getResetPassword = function(req, res) {
  User.findOne({email: req.body.email}).then( user => {
    if (!user) {
      errorHandler.error(res, "Navré, cette adresse email n'est pas dans notre base de donnée");
    } else {
      let resetToken = new Reset({
        _user: user._id
      });
      resetToken.save(function(err, token) {
        if (!err) {
          mailer.mailtoResetPassword(user, 'Pépite re-initilaisation de mot de passe', token._id);
          res.json({success: true});
        } else {
          errorHandler.error(res, "Le mail permettant de ré-initialiser votre mot de passe n'a pas pu être envoyer");
        }
      });
    }
  });
}

exports.resetPassword = function(req, res) {
  Reset.findById(req.params.id).populate('_user').then(resetPassword => {
    if (resetPassword) {
      let user = resetPassword._user;
      if(req.body.password) {
        passwordService.setUserPassword(user, req.body.password);
      }
      req.body = user;
      req.body.updated_at = moment();
      User.update({_id: user._id}, req.body, function(err, raw) {
        if(err) {
          errorHandler.error(res, 'Impossible de modifier cet utilisateur');
        } else {
          Reset.deleteOne({_id: req.params.id}, function(err) {
            (err) ? res.json(err) : res.json(raw);
          });
        }
      });
    } else {
      errorHandler.error(res, 'Impossible de modifier le mot de passe de cet utilisateur')
    }
  });
}
