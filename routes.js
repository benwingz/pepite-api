module.exports = function(app) {
  var express = require('express');
  var mongoose = require('mongoose');
  var bodyParser = require('body-parser');
  var config = require('./config');
  var jwt = require('jsonwebtoken');

  var userController = require('./app/controllers/user.controller');
  var User = require('./app/models/user.model');

  mongoose.connect(config.database);
  app.set('superSecret', config.secret);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var apiRoutes = express.Router();

  //unauthenticate routes
  apiRoutes.use(function(req,res,next){
    res.contentType('application/json');

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');

    console.log(req.method);
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  });
  apiRoutes.get('/', function(req, res) {
    res.json('welcome to Pepite API');
  });

  apiRoutes.get('/users', userController.getAllUser);
  apiRoutes.get('/user/:id', userController.findOneById);
  apiRoutes.post('/user', userController.createUser);
  //apiRoutes.post('/user', user.createUser);

  //apiRoutes.post('/authenticate', user.authenticate);

  apiRoutes.use(function(req,res,next){

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

    if(token && token.indexOf('Bearer ') !== -1) {
      token = token.replace('Bearer ', '');
    }
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          console.log('Token invalid');
          return res.json({ success: false, message: 'Failed to authenticate token.'})
        } else {
          console.log('Token valid');
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
  //apiRoutes.get('/me', user.findUser);

  app.use('/api', apiRoutes);
}
