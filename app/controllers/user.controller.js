var mongoose = require('mongoose');

var User = require('../models/user.model');

exports.getAllUser = function(req, res){
  User.find().then(
    function(users) {
      res.json(users);
    },
    function(error){
      console.log(error);
    })
};

exports.findOneById = function(req, res){
  User.findById(req.params.id ,function(err, user) {
      if(err) {
        res.json({ success: false, message: 'Impossible de trouver cet utilisateur.'})
      } else {
        console.log("user", user);
        res.json(user);
      }
    }
  );
};

exports.createUser = function(req, res) {
  if(!req.body.firstname || !req.body.lastname) {
    res.json({ success: false, message: "Il manque un paramètre pour compléter la creation de l'utilisateur"})
  } else {
    User.findOne({firstname: req.body.firstname, lastname: req.body.lastname}, function(err, user){
      if(user) {
        res.json({ success: false, message: 'Un utilisateur similaire existe déjà'});
      } else {
        var newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname});
        newUser.save(function(err){
          if(err) {
            res.json({ success: false, message: "L'utilisateur n'a pas pu être créé"});
          } else {
            res.json({ success: true, message: 'Utilisateur enregistré'})
          }
        });
      }
    });
  }
}
