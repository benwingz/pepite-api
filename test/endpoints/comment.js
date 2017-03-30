var chai = require('chai');
var chaiHttp = require('chai-http');
process.env.ENV = 'TEST';
var server = require('../../server');
var should = chai.should;

var Grade = require('../../app/models/grade.model');
var Comment = require('../../app/models/comment.model');
var User = require('../../app/models/user.model');
var Category = require('../../app/models/category.model');

chai.use(chaiHttp);

exports.test = function(token){

  describe('Comment', function(){

    beforeEach((done) => {
      Grade.remove({}, (err) => {
        done();
      });
    });

    beforeEach((done) => {
      Comment.remove({}, (err) => {
        done();
      });
    });

    beforeEach((done) => {
      User.remove({}, (err) => {
        done();
      });
    });

    beforeEach((done) => {
      Category.remove({}, (err) => {
        done();
      });
    });

    describe('GET comment', () => {
      it('should get all the comments when there is none', (done) => {
        chai.request(server)
          .get('/api/comments')
          .set('authorization', 'Bearer ' + token)
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.success.should.be.equal(false);
            res.body.message.should.be.equal('Aucuns commentaires');
            done();
          });
      });
    });

    describe('POST comment', () => {
      it('it should post a comment', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['touche pas a grisby salope']
        });
        category.save();
        let grade = new Grade ({
          user: user._id,
          category: category._id,
          user_eval: {value: 5}
        });
        grade.save();
        let comment = {
          grade: grade._id,
          user: user._id,
          content: 'Joyeux anniversaire'
        }
        chai.request(server)
          .post('/api/comment')
          .set('authorization', 'Bearer ' + token)
          .send(comment)
          .end((err, res) => {
            console.log(res.body);
            res.should.have.property('status', 200);
            res.body.success.should.be.equal(true);
            res.body.should.have.property('message', 'Commentaire ajouté');
            done()
          });
      })
    });

    describe('GET comments', () => {
      it('should get all the comment when there is one', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['touche pas a grisby salope']
        });
        category.save();
        let grade = new Grade ({
          user: user._id,
          category: category._id,
          user_eval: {value: 5}
        });
        grade.save();
        let comment = new Comment({
          _grade: grade._id,
          _user: user._id,
          content: 'Joyeux anniversaire'
        })
        comment.save(function() {
          chai.request(server)
            .get('/api/grades')
            .set('authorization', 'Bearer ' + token)
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.should.be.an.Array;
              res.body.length.should.be.equal(1);
              done();
            });
        });
      });
    });

    describe('GET comment/:id', () => {
      it('should get a specific comment', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['touche pas a grisby salope']
        });
        category.save();
        let grade = new Grade ({
          user: user._id,
          category: category._id,
          user_eval: {value: 5}
        });
        grade.save();
        let comment = new Comment({
          _grade: grade._id,
          _user: user._id,
          content: 'Joyeux anniversaire'
        })
        comment.save(function() {
          chai.request(server)
            .get('/api/comment/' + comment._id)
            .set('authorization', 'Bearer ' + token)
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.content  .should.be.equal('Joyeux anniversaire');
              done();
            });
        });
      });
    });

    describe('DELETE comment', () => {
      it('should delete a specific comment', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['touche pas a grisby salope']
        });
        category.save();
        let grade = new Grade ({
          user: user._id,
          category: category._id,
          user_eval: {value: 5}
        });
        grade.save();
        let comment = new Comment({
          _grade: grade._id,
          _user: user._id,
          content: 'Joyeux anniversaire'
        })
        comment.save(function() {
          chai.request(server)
            .delete('/api/comment')
            .set('authorization', 'Bearer ' + token)
            .send({id: comment._id})
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.success.should.be.equal(true);
              res.body.should.have.property('message', 'Commentaire supprimée');
              done();
            });
        });
      });
    });

    describe('GET grade/:id/comments', () => {
      it('should get a grade comments', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['touche pas a grisby salope']
        });
        category.save();
        let grade = new Grade ({
          user: user._id,
          category: category._id,
          user_eval: {value: 5}
        });
        grade.save();
        let comment = new Comment({
          _grade: grade._id,
          _user: user._id,
          content: 'Joyeux anniversaire'
        })
        comment.save(function() {
          chai.request(server)
            .get('/api/grade/' + grade._id + '/comments')
            .set('authorization', 'Bearer ' + token)
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.should.be.an.Array;
              res.body.length.should.be.equal(1);
              done();
            });
        });
      });
    });

    describe('PATCH comment', () => {
      it('should patch a specific comment', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['touche pas a grisby salope']
        });
        category.save();
        let grade = new Grade ({
          user: user._id,
          category: category._id,
          user_eval: {value: 5}
        });
        grade.save();
        let comment = new Comment({
          _grade: grade._id,
          _user: user._id,
          content: 'Joyeux anniversaire'
        })
        comment.save(function() {
          chai.request(server)
            .patch('/api/comment')
            .set('authorization', 'Bearer ' + token)
            .send({id: comment._id, content: 'Un bon bourre pif'})
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.n.should.be.equal(1);
              res.body.nModified.should.be.equal(1);
              res.body.ok.should.be.equal(1);
              done();
            });
        });
      });
    });

  })
}
