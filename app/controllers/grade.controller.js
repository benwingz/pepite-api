var mongoose = require('mongoose');
var BlueBirdPromise = require('bluebird');
var config = require('../../config');

var Grade = require('../models/grade.model');
var User = require('../models/user.model');
var Category = require('../models/category.model');

var errorHandler = require('../service/error.service');
var authRequest = require('../service/authrequest.service');
var queryBuilder = require('../service/queryBuilder.service');

var responseGrades = function(grades, res) {
  if (grades.length > 0) {
    res.json(grades);
  } else {
    errorHandler.error(res, "Aucune évaluation");
  }
}

exports.getAllGrades = function(req, res){
  let user = authRequest.returnUser(req);
  switch (user.type) {
    case 'admin':
        queryBuilder.buildQueryFind(Grade,{
          find: {},
          populate: [
            {field: '_user', filter:'-password -salt -type'},
            {field: '_validator', filter:'-password -salt -type'}]
        }).then(
          function(grades) {
            responseGrades(grades, res);
          },
          function(error) {
            errorHandler.error(res, "Impossible de récupérer les évaluations");
          }
        );
      break;
    case 'pepite-admin':
      queryBuilder.buildQueryFind(User,{find: {_pepite: user._pepite}})
        .then(
          function(users) {
            queryBuilder.buildQueryFind(Grade, {
              find: {},
              populate: [
                {field: '_user', filter:'-password -salt -type'},
                {field: '_validator', filter:'-password -salt -type'}],
              where: {_user: {$in: users}}
            }).then(
              function(grades) {
                responseGrades(grades, res);
              },
              function(error) {
                errorHandler.error(res, "Impossible de récupérer les évaluations");
              }
            );
          }
        );
      break;
    case 'validator':
    queryBuilder.buildQueryFind(User,{find: {_validator: user._id}})
      .then(
        function(users) {
          queryBuilder.buildQueryFind(Grade, {
            find: {},
            populate: [
              {field: '_user', filter:'-password -salt -type'},
              {field: '_validator', filter:'-password -salt -type'}],
            where: {_user: {$in: users}}
          }).then(
            function(grades) {
              responseGrades(grades, res);
            },
            function(error) {
              errorHandler.error(res, "Impossible de récupérer les évaluations");
            }
          );
        }
      );
      break;
    default:
      queryBuilder.buildQueryFind(Grade,{
        find: {_user: user._id},
        populate: [
          {field: '_user', filter:'-password -salt -type'},
          {field: '_validator', filter:'-password -salt -type'}]
      }).then(
        function(grades) {
          responseGrades(grades, res)
        },
        function(error) {
          errorHandler.error(res, "Impossible de récupérer les évaluations");
        }
      );
  }
};

exports.getAllGradesByUser = function(req, res) {
  if (req.params.id) {
    Grade.find({_user: req.params.id})
      .populate('_user', '-password -salt -type')
      .populate('_validator', '-password -salt -type')
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
  var req = authRequest.concatRequestWithAuth(req, {});
  Grade.findById(req)
    .populate('_user', '-password -salt -type')
    .populate('_validator', '-password -salt -type')
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
  Grade.deleteOne({ _id: req.params.id }, function(err) {
    if (err) {
      errorHandler.error(res, "Impossible de supprimer cette évaluation");
    } else {
      res.json({success: true, message: "Évaluation supprimée"});
    }

  })
};

var categoryGradesHandler = function(error, grades, res) {
  if (grades.length > 0) {
    res.json(grades);
  } else {
    errorHandler.error(res, "Aucune note pour cette catégorie");
  }
};

exports.getCategoryGrade = function(req, res) {
  let user = authRequest.returnUser(req);
  switch (user.type) {
    case 'admin':
      queryBuilder.buildQueryFind(Grade,{
        find: {_category: req.params.id},
        populate: [
          {field: '_user', filter:'-password -salt -type'},
          {field: '_validator', filter:'-password -salt -type'}]
      }).then(
        function(grades) {
          responseGrades(grades, res);
        },
        function(error) {
          errorHandler.error(res, 'Aucune note pour cette catégorie');
        }
      );
      break;
    case 'pepite-admin':
    case 'validator':
      queryBuilder.buildQueryFind(Grade,{
        find: {_category: req.params.id},
        populate: [
          {field: '_user', filter:'-password -salt -type'},
          {field: '_validator', filter:'-password -salt -type'}],
        where: {_user: req.query.user}
      }).then(
        function(grades) {
          responseGrades(grades, res);
        },
        function(error) {
          errorHandler.error(res, 'Aucune note pour cette catégorie');
        }
      );
      break;
    default:
      queryBuilder.buildQueryFind(Grade,{
        find: {_category: req.params.id},
        populate: [
          {field: '_user', filter:'-password -salt -type'},
          {field: '_validator', filter:'-password -salt -type'}],
        where: {_user: user._id}
      }).then(
        function(grades) {
          responseGrades(grades, res);
        },
        function(error) {
          errorHandler.error(res, 'Aucune note pour cette catégorie');
        }
      );
  }
};

exports.getPhaseGrade = function(req, res) {
  var user = authRequest.returnUser(req);
  queryBuilder.buildQueryFind(Category, {
    find: {_phase: req.params.id}
  }).then(
    function(categories) {
      if(categories.length > 0) {
        var phaseGradePromises = [];
        categories.map(function(category) {
          switch (user.type) {
            case 'admin':
              phaseGradePromises.push(queryBuilder.buildQueryFind(Grade,{
                find: {_category: category.id},
                populate: [
                  {field: '_user', filter:'-password -salt -type'},
                  {field: '_validator', filter:'-password -salt -type'}]
              }));
              break;
            case 'pepite-admin':
            case 'validator':
              phaseGradePromises.push(queryBuilder.buildQueryFind(Grade,{
                find: {_category: category.id},
                populate: [
                  {field: '_user', filter:'-password -salt -type'},
                  {field: '_validator', filter:'-password -salt -type'}],
                where: {_user: req.query.user}
              }));
              break;
            default:
              phaseGradePromises.push(queryBuilder.buildQueryFind(Grade,{
                find: {_category: category.id},
                populate: [
                  {field: '_user', filter:'-password'},
                  {field: '_validator', filter:'-password'}],
                where: {_user: user._id}
              }));
          }
        });
        var phaseGrades = [];
        BlueBirdPromise.each(phaseGradePromises, function(grades, index, length) {
          grades.map(function(grade) {
            phaseGrades.push(grade);
          });
        }).then(function() {
          responseGrades(phaseGrades, res);
        });
      } else {
        errorHandler.error(res, "Impossible de récupérer les évaluations de cette phase");
      }
    },
    function(error) {
      errorHandler.error(res, "Impossible de récupérer les évaluations de cette phase");
    }
  );
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
