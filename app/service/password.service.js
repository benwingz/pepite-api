var crypto = require('crypto'),
    algorithm = 'sha512',
    salt = 'pepiteAPISalt';

function encrypt(password){
  var hash = crypto.createHmac(algorithm,salt)
  hash.update(password);
  var value = hash.digest('hex');
  return value;
}

exports.encryptPassword = function(password){
  return encrypt(password);
}

exports.checkPassword = function(password, user){
  var hash = encrypt(password);
  return hash === user.password;
}
