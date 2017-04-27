var mongoose = require('mongoose');


var config = require('../../config');
var Pepite = require('../models/pepite.model');

var errorHandler = require('../service/error.service');
var authRequest = require('../service/authrequest.service');

exports.getAllPepites = function(req, res) {
  var user = authRequest.returnUser(req);
  if (['admin'].indexOf(user.type) > -1) {
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
  } else {
    errorHandler.error(res, "Impossibe de récupérer les pepites");
  }
};

exports.findOnePepite = function(req, res){
  var user = authRequest.returnUser(req);
  if (['admin', 'pepite-admin'].indexOf(user.type) > -1) {
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
  } else {
    errorHandler.error(res, "Impossibe de récupérer la pepite");
  }
};

exports.createPepite = function(req, res) {
  var user = authRequest.returnUser(req);
  if (['admin'].indexOf(user.type) > -1) {
    if (!req.body.name) {
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
              res.json({success: true, message:'La pépite a été créée'});
            }
          });
        }
      });
    }
  } else {
    errorHandler.error(res, "Impossibe de créer les pepites");
  }
};

exports.deletePepite = function(req, res) {
  var user = authRequest.returnUser(req);
  if (['admin'].indexOf(user.type) > -1) {
    Pepite.deleteOne({ _id: req.body.id }, function(err) {
      if (err) {
        errorHandler.error(res, "Impossible de supprimer cette pépite");
      } else {
        res.json({success: true, message: "Pépite supprimée"});
      }

    })
  } else {
    errorHandler.error(res, "Impossible de supprimer cette pépite");
  }
};

exports.patchPepite = function(req, res) {
  var user = authRequest.returnUser(req);
  if (['admin', 'pepite-admin'].indexOf(user.type) > -1) {
    req.body.creation_date = new Date();
    Pepite.update({_id: req.body.id}, req.body, function(err, raw) {
      if(err) {
        errorHandler(res, 'Impossible de modifier cette pépite');
      } else {
        res.json(raw);
      }
    });
  } else {
    errorHandler(res, 'Impossible de modifier cette pépite');
  }
};
