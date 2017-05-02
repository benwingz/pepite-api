var mongoose = require('mongoose');

var Comment = require('../models/comment.model');

var errorHandler = require('../service/error.service');
var authRequest = require('../service/authrequest.service');
var queryBuilder = require('../service/queryBuilder.service');


exports.getAllComments = function(req, res){
  Comment.find().populate('_category').populate('_user').then(
    function(comments) {
      if (comments.length > 0) {
        res.json(comments);
      } else {
        errorHandler.error(res, "Aucun commentaire");
      }
    },
    function(error){
      errorHandler.error(res, "Impossible de récupérer les commentaires");
    })
};

exports.findOneCommentById = function(req, res){
  Comment.findById(req.params.id)
    .populate('_user')
    .exec(function(err, comment) {
      if (err) {
        errorHandler.error(res, 'Impossible de trouver ce commentaire.');
      } else {
        res.json(comment);
      }
    }
  );
};

exports.createComment = function(req, res) {
  if (!req.body.user || !req.body.category || !req.body.content || !req.body.userlink) {
    errorHandler.error(res, "Il manque un paramètre pour compléter la creation de l'évaluation");
  } else {
    var newComment = new Comment({
      userlink: req.body.userlink,
      _category: req.body.category,
      _user: req.body.user,
      content: req.body.content,
      date: new Date()
    });
    newComment.save(function(err){
      if (err) {
        errorHandler.error(res, "Le commentaire n'a pas pû être ajouté");
      } else {
        res.json({ success: true, message: 'Commentaire ajouté'});
      }
    });
  }
};

exports.deleteComment = function(req, res) {
  var user = authRequest.returnUser(req);
  switch (user.type) {
    case 'admin':
    case 'pepite-admin':
      Comment.deleteOne({ _id: req.params.id }, function(err) {
        if (err) {
          errorHandler.error(res, "Impossible de supprimer ce commentaire");
        } else {
          res.json({success: true, message: "Commentaire supprimé"});
        }
      })
      break;
    default:
      Comment.deleteOne({ _id: req.params.id, _user: user._id }, function(err, query) {
        if (err || query.deletedCount == 0) {
          errorHandler.error(res, "Impossible de supprimer ce commentaire");
        } else {
          res.json({success: true, message: "Commentaire supprimé"});
        }
      })

  }
};

exports.getCommentsCategory = function(req, res) {
  var query;
  var user = authRequest.returnUser(req);
  if (req.query.user) {
    query = Comment.find({
      _category: req.params.id
    })
    query.where('userlink').equals(req.query.user);
  } else {
    query = Comment.find({
      _category: req.params.id,
      $or:[{_user: user._id},{_user: user._validator}]
    })
    .where('userlink').equals(user._id);
  }
  query.populate('_user', '-salt -password -type')
  .sort('date')
  .exec(function(err, comments) {
    if (err) {
      errorHandler.error(res, "Impossible de récupérer les commentaires de cette évaluation");
    } else {
      res.json(comments);
    }
  });
}

exports.patchComment = function(req, res) {
  var user = authRequest.returnUser(req);
  if(req.body.id == user._id) {
    if (req.body.content) {
      Comment.update({_id: req.body.id}, {content: req.body.content, date: new Date()}, function(err, raw) {
        if (err) {
          errorHandler(res, "Impossible de mettre à jour ce commentaire");
        } else {
          res.json(raw);
        }
      });
    } else {
      errorHandler.error(res, "Paramètre manquant");
    }
  } else {
    errorHandler(res, "Impossible de mettre à jour ce commentaire");
  }
}
