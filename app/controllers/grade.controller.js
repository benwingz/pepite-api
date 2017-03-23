var mongoose = require('mongoose');

var Grade = require('../models/grade.model');

var errorHandler = require('../service/error.service');


exports.getAllGrades = function(req, res){
  Grade.find()
    .populate('_user')
    .populate('_validator')
    .then(
      function(grades) {
        if(grades.length > 0) {
          res.json(grades);
        } else {
          errorHandler.error(res, "Aucune évaluation");
        }
      },
      function(error){
        errorHandler.error(res, "Impossible de récupérer les évaluations");
      }
    );
};

exports.findOneGradeById = function(req, res){
  Grade.findById(req.params.id)
    .populate('_user')
    .populate('_validator')
    .exec(function(err, grade) {
      if(err) {
        errorHandler.error(res, 'Impossible de trouver cette évaluation.');
      } else {
        res.json(grade);
      }
    }
  );
};

exports.createGrade = function(req, res) {
  if(!req.body.user || !req.body.category || !req.body.value) {
    errorHandler.error(res, "Il manque un paramètre pour compléter la creation de l'évaluation");
  } else {
    Grade.findOne({_category: req.body.category, _user: req.body.user}, function(err, user){
      if(user) {
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
          if(err) {
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

exports.getCategoryGrade = function(req, res) {
  Grade.find({ _category:req.params.id })
    .populate('_user')
    .populate('_validator')
    .exec(function(err, grades) {
      if(err) {
        errorHandler.error(res, "Impossible de récupérer l'évaluation de cette catégorie");
      } else {
        if(grades.length > 0) {
          res.json(grades);
        } else {
          errorHandler.error(res, "Aucune note pour cette catégorie");
        }
      }
    })
}
