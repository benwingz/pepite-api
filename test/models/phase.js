
var utils = require('../utils');
var should = require('should');
var Phase = require('../../app/models/phase.model');

exports.test = function() {
  describe('Phase: models', function () {

    describe('#create()', function () {
      it('should create a new Phase', function (done) {
        var p = {
          title: 'My new phase'
        };
        Phase.create(p, function (err, createdPhase) {
          should.not.exist(err);
          createdPhase.title.should.equal('My new phase');
          done();
        });
      });
    });

  });
}
