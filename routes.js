module.exports = function(app) {
  var express = require('express');
  var mongoose = require('mongoose');
  var bodyParser = require('body-parser');
  var config = require('./config');
  var jwt = require('jsonwebtoken');

  var userController = require('./app/controllers/user.controller');
  var phaseController = require('./app/controllers/phase.controller');
  var gradeController = require('./app/controllers/grade.controller');
  var commentController = require('./app/controllers/comment.controller');
  var pepiteController = require('./app/controllers/pepite.controller');

  var User = require('./app/models/user.model');

  mongoose.connect(config[process.env.ENV].database);
  app.set('superSecret', config[process.env.ENV].secret);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var apiRoutes = express.Router();

  //Middleware CORS
  apiRoutes.use(function(req,res,next){
    res.contentType('application/json');

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  });

  //unauthenticate routes
  apiRoutes.get('/', function(req, res) {
    res.json('welcome to Pepite API');
  });

  //Phase routes
  apiRoutes.get('/phases', phaseController.getAllPhases);
  apiRoutes.get('/phase/:id/categories', phaseController.getPhaseCategories);

  apiRoutes.post('/authenticate', userController.authenticate);

  apiRoutes.use(function(req,res,next){

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

    if (token && token.indexOf('Bearer ') !== -1) {
      token = token.replace('Bearer ', '');
    }
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.'})
        } else {
          req.decode = decoded;
          next();
        }
      })
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }

  });

  //authenticate routes

  //User routes
  apiRoutes.get('/users', userController.getAllUser);
  apiRoutes.get('/user/:id', userController.findUserById);
  apiRoutes.post('/user', userController.createUser);
  apiRoutes.delete('/user', userController.deleteUser);
  apiRoutes.patch('/user', userController.patchUser);

  //Pepite routes
  apiRoutes.get('/pepites', pepiteController.getAllPepites);
  apiRoutes.get('/pepite/:id', pepiteController.findOnePepite);
  apiRoutes.post('/pepite', pepiteController.createPepite);
  apiRoutes.delete('/pepite', pepiteController.deletePepite);
  apiRoutes.patch('/pepite', pepiteController.patchPepite);

  //Grade routes
  apiRoutes.get('/grades', gradeController.getAllGrades);
  apiRoutes.get('/user/:id/grades', gradeController.getAllGradesByUser);
  apiRoutes.get('/grade/:id', gradeController.findOneGradeById);
  apiRoutes.post('/grade', gradeController.createGrade);
  apiRoutes.delete('/grade', gradeController.deleteGrade);
  apiRoutes.get('/category/:id/grades', gradeController.getCategoryGrade);
  apiRoutes.get('/phase/:id/grades', gradeController.getPhaseGrade);
  apiRoutes.patch('/grade', gradeController.patchGrade);

  //Comment routes
  apiRoutes.get('/comments', commentController.getAllComments);
  apiRoutes.get('/comment/:id', commentController.findOneCommentById);
  apiRoutes.post('/comment', commentController.createComment);
  apiRoutes.delete('/comment', commentController.deleteComment);
  apiRoutes.get('/grade/:id/comments', commentController.getCommentsGrade)
  apiRoutes.patch('/comment', commentController.patchComment);
  //apiRoutes.post('/user', user.createUser);

  app.use('/api', apiRoutes);
}
