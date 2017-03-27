var mongoose = require('mongoose');

var User = require('../models/user.model');

var errorHandler = require('../service/error.service');


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
  if(!req.body.firstname || !req.body.lastname) {
    errorHandler.error(res, "Il manque un paramètre pour compléter la creation de l'utilisateur");
  } else {
    User.findOne({firstname: req.body.firstname, lastname: req.body.lastname}, function(err, user){
      if (user) {
        errorHandler.error(res, 'Un utilisateur similaire existe déjà');
      } else {
        var newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname});
        newUser.save(function(err){
          if (err) {
            errorHandler.error(res, "L'utilisateur n'a pas pu être créé");
          } else {
            res.json({ success: true, message: 'Utilisateur enregistré'});
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
