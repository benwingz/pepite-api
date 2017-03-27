var utils = require('../utils');
var should = require('should');
var Grade = require('../../app/models/grade.model');
var mongoose = require('mongoose');
var categoryId = new mongoose.Types.ObjectId;
var userId = new mongoose.Types.ObjectId;
var validatorId = new mongoose.Types.ObjectId;
var date = new Date;

exports.test = function() {

  describe('Grade: models', function () {

    describe('#create()', function () {
      it('should create a new Grade', function (done) {
        var c = {
          _category: categoryId,
          _user: userId,
          _validator: validatorId,
          user_eval: {value: 5, date: date},
          validator_eval: {value: 5, date: date},
        };
        Grade.create(c, function (err, createdGrade) {
          should.not.exist(err);
          createdGrade._category.should.equal(categoryId);
          createdGrade._user.should.equal(userId);
          createdGrade._validator.should.equal(validatorId);
          createdGrade.user_eval.value.should.equal(5);
          createdGrade.user_eval.date.should.equal(date);
          createdGrade.validator_eval.value.should.equal(5);
          createdGrade.validator_eval.date.should.equal(date);
          done();
        });
      });
    });

  });
}
