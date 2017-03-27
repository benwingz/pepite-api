// import the moongoose helper utilities
var utils = require('../utils');
var should = require('should');
// import our User mongoose model
var User = require('../../app/models/user.model');

exports.test = function() {
  describe('Users: models', function () {

    describe('#create()', function () {
      it('should create a new User', function (done) {
        // Create a User object to pass to User.create()
        var u = {
          firstname: 'Lino',
          lastname: 'Ventura'
        };
        User.create(u, function (err, createdUser) {
          // Confirm that that an error does not exist
          should.not.exist(err);
          // verify that the returned user is what we expect
          createdUser.firstname.should.equal('Lino');
          createdUser.lastname.should.equal('Ventura');
          // Call done to tell mocha that we are done with this test
          done();
        });
      });
    });

  });
}
