// import the moongoose helper utilities
var utils = require('../utils');
var should = require('should');
var Category = require('../../app/models/category.model');
var mongoose = require('mongoose');
var phaseId = new mongoose.Types.ObjectId;

exports.test = function() {

  describe('Category: models', function () {

    describe('#create()', function () {
      it('should create a new Category', function (done) {
        var c = {
          title: 'My new Category',
          skills: ['Be a ninja in javascript'],
          _phase: phaseId
        };
        Category.create(c, function (err, createdCategory) {
          should.not.exist(err);
          createdCategory.title.should.equal('My new Category');
          createdCategory.skills[0].should.equal('Be a ninja in javascript');
          createdCategory._phase.should.equal(phaseId);
          done();
        });
      });
    });

  });
}
