var mongoose = require('mongoose');

var Comment = require('../models/comment.model');

var errorHandler = require('../service/error.service');


exports.getAllComments = function(req, res){
  Comment.find().populate('_category').populate('_user').then(
    function(comments) {
      if (comments.length > 0) {
        res.json(comments);
      } else {
        errorHandler.error(res, "Aucuns commentaires");
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
  if (!req.body.user || !req.body.grade || !req.body.content) {
    errorHandler.error(res, "Il manque un paramètre pour compléter la creation de l'évaluation");
  } else {
    var newComment = new Comment({
      _grade: req.body.grade,
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
  Comment.deleteOne({ _id: req.body.id }, function(err) {
    if (err) {
      errorHandler.error(res, "Impossible de supprimer ce commentaire");
    } else {
      res.json({success: true, message: "Commentaire supprimée"});
    }

  })
};

exports.getCommentsGrade = function(req, res) {
  Comment.find({_grade: req.params.id}).populate('_user').exec(function(err, comments) {
    if (err) {
      errorHandler.error(res, "Impossible de récupérer les commentaires de cette évaluation");
    } else {
      res.json(comments);
    }
  })
}

exports.patchComment = function(req, res) {
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
}
