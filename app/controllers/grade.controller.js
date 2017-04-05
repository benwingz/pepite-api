var mongoose = require('mongoose');
var BlueBirdPromise = require('bluebird');
var config = require('../../config');

var Grade = require('../models/grade.model');
var Category = require('../models/category.model');

var errorHandler = require('../service/error.service');
var jwtService = require('../service/jwt.service');


exports.getAllGrades = function(req, res){
  if (req.headers['authorization']) {
    var token = req.headers['authorization'].replace('Bearer ', '');
    var resolved = jwtService.resolveJwt(token, config[process.env.ENV].secret);
    if (resolved) {
      var req = {
        user: decoded._id
      }
    } else {
      var req = {};
    }
  } else {
    var req = {};
  }
  Grade.find()
    .populate({path:'_user', path:'_validator'})
    .exec(
      function(err, grades) {
        if(err) {
          errorHandler.error(res, "Impossible de récupérer les évaluations");
          return;
        }
        if (grades.length > 0) {
          res.json(grades);
        } else {
          errorHandler.error(res, "Aucune évaluation");
        }
      },
      function(error){

      }
    );
};

exports.getAllGradesByUser = function(req, res) {
  if (req.params.id) {
    Grade.find({_user: req.params.id})
      .populate('_user')
      .populate('_validator')
      .then(
        function(grades) {
          if (grades.length > 0) {
            res.json(grades);
          } else {
            errorHandler.error(res, "Aucune évaluation");
          }
        },
        function(error){
          errorHandler.error(res, "Impossible de récupérer les évaluations");
        }
      );
  }
}

exports.findOneGradeById = function(req, res){
  Grade.findById(req.params.id)
    .populate('_user')
    .populate('_validator')
    .exec(function(err, grade) {
      if (err) {
        errorHandler.error(res, 'Impossible de trouver cette évaluation.');
      } else {
        res.json(grade);
      }
    }
  );
};

exports.createGrade = function(req, res) {
  if (!req.body.user || !req.body.category || !req.body.value) {
    errorHandler.error(res, "Il manque un paramètre pour compléter la creation de l'évaluation");
  } else {
    Grade.findOne({_category: req.body.category, _user: req.body.user}, function(err, user){
      if (user) {
        errorHandler.error(res, 'Une évaluation existe déjà pour cette catégorie');
      } else {
        var newGrade = new Grade({
          _category: req.body.category,
          _user: req.body.user,
          user_eval: {
            value: req.body.value,
            date: new Date()
          }
        });
        newGrade.save(function(err){
          if (err) {
            errorHandler.error(res, "L'évaluation n'a pas pu être créé");
          } else {
            res.json({ success: true, message: 'Évaluation enregistrée'});
          }
        });
      }
    });
  }
};

exports.deleteGrade = function(req, res) {
  Grade.deleteOne({ _id: req.body.id }, function(err) {
    if (err) {
      errorHandler.error(res, "Impossible de supprimer cette évaluation");
    } else {
      res.json({success: true, message: "Évaluation supprimée"});
    }

  })
};

var categoryGrades = function(id) {
  return Grade.find({ _category: id })
    .populate('_user')
    .populate('_validator')
    .exec()
}

exports.getCategoryGrade = function(req, res) {
  categoryGrades(req.params.id).then(function(grades) {
      if (grades.length > 0) {
        res.json(grades);
      } else {
        errorHandler.error(res, "Aucune note pour cette catégorie");
      }
    },
    function(err) {
      errorHandler.error(res, "Impossible de récupérer l'évaluation de cette catégorie");
    }
  )
};

exports.getPhaseGrade = function(req, res) {
  Category.find({ _phase: req.params.id }, function(err, categories) {
    if (err) {
      errorHandler.error(res, "Impossible de récupérer les évaluations de cette phase");
    } else {
      if (categories.length > 0) {
        var phaseGradePromises = [];
        categories.map(function(category) {
          phaseGradePromises.push(categoryGrades(category.id));
        });
        var phaseGrades = [];
        BlueBirdPromise.each(phaseGradePromises, function(grades, index, length) {
          grades.map(function(grade) {
            phaseGrades.push(grade);
          });
        }).then(function() {
          if (phaseGrades.length == 0) {
            errorHandler.error(res, "Aucune note pour cette phase");
          } else {
            res.json(phaseGrades);
          }
        });
      } else {
        errorHandler.error(res, "Aucune note pour cette phase");
      }
    }
  })
};

exports.patchGrade = function(req, res) {
  if (req.body['user_eval.value']) {
    req.body['user_eval.date'] = new Date();
  }
  if (req.body['validator_eval.value'] && req.body._validator) {
    req.body['validator_eval.date'] = new Date();
  } else {
    delete req.body['validator_eval.value'];
  }
  Grade.update({_id: req.body.id}, req.body, function(err, raw) {
    if (err) {
      errorHandler(res, "Impossible de mettre à jour cette évaluation");
    } else {
      res.json(raw);
    }
  });
};
