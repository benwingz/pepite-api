var utils = require('../utils');
var should = require('should');
var Comment = require('../../app/models/comment.model');
var mongoose = require('mongoose');
var gradeId = new mongoose.Types.ObjectId;
var userId = new mongoose.Types.ObjectId;
var date = new Date;

exports.test = function() {

  describe('Comment: models', function () {

    describe('#create()', function () {
      it('should create a new Comment', function (done) {
        var c = {
          _grade: gradeId,
          _user: userId,
          content: 'This is my first comment',
          date: date
        };
        Comment.create(c, function (err, createdComment) {
          should.not.exist(err);
          createdComment._grade.should.equal(gradeId);
          createdComment._user.should.equal(userId);
          createdComment.content.should.equal('This is my first comment');
          createdComment.date.should.equal(date);
          done();
        });
      });
    });

  });
}
