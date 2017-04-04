var mongoose = require('mongoose');


var config = require('../../config');
var Pepite = require('../models/pepite.model');

var errorHandler = require('../service/error.service');

exports.getAllPepites = function(req, res){
  Pepite.find()
    .populate('_admin', '-password -salt')
    .exec(
      function(err, pepites) {
        if (err) {
          errorHandler.error(res, "Impossibe de récupérer les pepites");
        } else {
          if(pepites.length == 0) {
            res.error(res, "Aucune pepite n'est enregistrée");
          } else {
            res.json(pepites)
          }
        }
      }
    );
};

exports.findOnePepite = function(req, res){
  Pepite.findById(req.params.id)
    .populate('_admin', '-password -salt')
    .exec(function(err, pepite) {
      if (err) {
        errorHandler.error(res, 'Impossible de trouver cette pépite.');
      } else {
        res.json(pepite);
      }
    }
  );
};

exports.createPepite = function(req, res) {
  if(!req.body.name || !req.body.admin) {
    errorHandler.error(res, "Il manque un paramètre pour compléter la creation de la pépite");
  } else {
    Pepite.findOne({name: req.body.name}, function(err, pepite){
      if (pepite) {
        errorHandler.error(res, 'Une pépite de ce nom existe déjà');
      } else {
        var newPepite = new Pepite({
          name: req.body.name,
          creation_date: new Date(),
          _admin: req.body.admin
        })
        newPepite.save(function(err) {
          if (err) {
            res.json(res, 'Impossible de créer la pépite');
          } else {
            res.json({success: true, message:'La pépite a été créé'});
          }
        });
      }
    });
  }
};

exports.deletePepite = function(req, res) {
  Pepite.deleteOne({ _id: req.body.id }, function(err) {
    if (err) {
      errorHandler.error(res, "Impossible de supprimer cette pépite");
    } else {
      res.json({success: true, message: "Pépite supprimé"});
    }

  })
};

exports.patchPepite = function(req, res) {
  req.body.creation_date = new Date();
  Pepite.update({_id: req.body.id}, req.body, function(err, raw) {
    if(err) {
      errorHandler(res, 'Impossible de modifier cette pépite');
    } else {
      res.json(raw);
    }

  })
};
