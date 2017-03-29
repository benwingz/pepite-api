var crypto = require('crypto');
var PasswordService = function() {
    this.generateSalt = function() {
        var length = 32;
        return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
    }
    this.cryptPassword = function(password, salt) {
        var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
        hash.update(password);
        var value = hash.digest('hex');
        return value;
    }
    /**
     * Used to ensure a user has a hash and a crypted password
     *
     * Don't use this method to set a new password
     */
    this.cryptUserPassword = function(user) {
        if (user.salt == '') {
            user.salt = this.generateSalt();
            user.password = cryptPassword(user.password, user.salt);
        }
    }
    this.setUserPassword = function(user, password) {
        user.salt = this.generateSalt();
        user.password = this.cryptPassword(password, user.salt);
    }
    this.checkPassword = function (user, password) {
        var hash = this.cryptPassword(password, user.salt);
        return hash === user.password;
    }
}
module.exports = (new PasswordService());
