var mongoose = require('mongoose');

var Phase = require('../models/phase.model');
var Category = require('../models/category.model');

var errorHandler = require('../service/error.service');

exports.getAllPhases = function(req, res) {
  Phase.find().then(
    function(phases) {
      if (phases.length == 0) {
        errorHandler.error(res, 'Aucune phase récupérable');
      } else {
        res.json(phases);
      }
    },
    function(err){
      errorHandler.error(res, 'Impossible de récupérer les phases');
    }
  );
};

exports.getPhaseCategories = function(req, res) {
  Phase.findOne({ _id: req.params.id}, function(err, phase) {
      if (phase) {
        Category.find({ _phase: phase._id}).then(
          function(categories) {
            if (categories.length > 0) {
              res.json(categories);
            } else {
              errorHandler.error(res, "Aucune catégorie n'est présente dans cette phase");
            }
          },
          function(err) {
            errorHandler.error(res, "Impossible de récupérer les catégories de cette phase");
          }
        );
      } else {
        errorHandler.error(res, 'Aucune phase ne correspond');
      }
    });
};
