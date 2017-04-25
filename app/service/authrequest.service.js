var config = require('../../config');
var jwt = require('jsonwebtoken');
var User = require('../models/user.model');

exports.returnUser = function(httpRequest) {
  if (httpRequest.headers['authorization']) {
    var token = httpRequest.headers['authorization'].replace('Bearer ', '');
    var user = jwt.decode(token, config[process.env.ENV].secret);
    return user;
  }
}
