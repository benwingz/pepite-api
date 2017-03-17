var mongoose = require('mongoose');

var User = require('../models/user.model');

exports.getAllUser = function(req, res){
  User.find().then(
    function(users) {
      res.json(users);
    },
    function(error){
      errorHandler(res, "Aucuns utilisateur trouvé");
    })
};

exports.findOneById = function(req, res){
  User.findById(req.params.id ,function(err, user) {
      if(err) {
        errorHandler(res, 'Impossible de trouver cet utilisateur.');
      } else {
        console.log("user", user);
        res.json(user);
      }
    }
  );
};

exports.createUser = function(req, res) {
  if(!req.body.firstname || !req.body.lastname) {
    errorHandler(res, "Il manque un paramètre pour compléter la creation de l'utilisateur");
  } else {
    User.findOne({firstname: req.body.firstname, lastname: req.body.lastname}, function(err, user){
      if(user) {
        errorHandler(res, 'Un utilisateur similaire existe déjà');
      } else {
        var newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname});
        newUser.save(function(err){
          if(err) {
            errorHandler(res, "L'utilisateur n'a pas pu être créé");
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
      errorHandler(res, "Impossible de supprimer cet utilisateur");
    } else {
      res.json({success: true, message: "Utilsateur supprimé"});
    }

  })
};

errorHandler = function(res, errorMessage) {
  res.json({ success: false, message: errorMessage})
}
