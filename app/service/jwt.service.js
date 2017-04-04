var config = require('../../config');
var jwt = require('jsonwebtoken');

exports.resolveJwt = function(token, secret) {
  jwt.verify(token, secret, function(err, decoded) {
    if (decoded) {
      return decoded
    } else {
      return false;
    }
  })
}
