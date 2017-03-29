var chai = require('chai');
var chaiHttp = require('chai-http');
process.env.ENV = 'TEST';
var server = require('../../server');
var should = chai.should;

var Grade = require('../../app/models/grade.model');
var Category = require('../../app/models/category.model');
var User = require('../../app/models/user.model');
var Phase = require('../../app/models/phase.model');

chai.use(chaiHttp);

exports.test = function(){

  describe('Grades', function(){

    beforeEach((done) => {
      Grade.remove({}, (err) => {
        done();
      });
    });

    beforeEach((done) => {
      Category.remove({}, (err) => {
        done();
      });
    });

    beforeEach((done) => {
      Phase.remove({}, (err) => {
        done();
      });
    });

    beforeEach((done) => {
      User.remove({}, (err) => {
        done();
      });
    });

    describe('GET grades', () => {
      it('should get all the grades when there is none', (done) => {
        chai.request(server)
          .get('/api/grades')
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.success.should.be.equal(false);
            res.body.message.should.be.equal('Aucune évaluation');
            done();
          });
      });
    });

    describe('POST grade', () => {
      it('it should post a grade', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let phase = new Phase({
          title: "Les bon films"
        });
        phase.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['Pas touche a grisby salope'],
          _phase: phase._id
        });
        category.save();
        let grade = {
          user: user._id,
          category: category._id,
          value: 5
        }
        chai.request(server)
          .post('/api/grade')
          .send(grade)
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.success.should.be.equal(true);
            res.body.should.have.property('message', 'Évaluation enregistrée');
            done()
          });
      })
    });

    describe('GET grades', () => {
      it('should get all the grade when there is one', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let phase = new Phase({
          title: "Les bon films"
        });
        phase.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['Pas touche a grisby salope'],
          _phase: phase._id
        });
        category.save();
        let grade = new Grade({
          _category: category._id,
          _user: user._id,
          user_eval: {value: 5}
        })
        grade.save(function() {
          chai.request(server)
            .get('/api/grades')
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.should.be.an.Array;
              res.body.length.should.be.equal(1);
              done();
            });
        });
      });
    });

    describe('GET user/:id/grades', () => {
      it('should get all the grade when there is one', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let phase = new Phase({
          title: "Les bon films"
        });
        phase.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['Pas touche a grisby salope'],
          _phase: phase._id
        });
        category.save();
        let grade = new Grade({
          _category: category._id,
          _user: user._id,
          user_eval: {value: 5}
        })
        grade.save(function() {
          chai.request(server)
            .get('/api/user/' + user._id + '/grades')
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.should.be.an.Array;
              res.body.length.should.be.equal(1);
              done();
            });
        });
      });
    });

    describe('GET grade/:id', () => {
      it('should get a specific grade', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let phase = new Phase({
          title: "Les bon films"
        });
        phase.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['Pas touche a grisby salope'],
          _phase: phase._id
        });
        category.save();
        let grade = new Grade({
          _category: category._id,
          _user: user._id,
          user_eval: {value: 5}
        })
        grade.save(() => {
          chai.request(server)
            .get('/api/grade/' + grade._id)
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.user_eval.value.should.be.equal(5);
              done();
            });
        });
      });
    });

    describe('DELETE grade', () => {
      it('should delete a specific grade', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let phase = new Phase({
          title: "Les bon films"
        });
        phase.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['Pas touche a grisby salope'],
          _phase: phase._id
        });
        category.save();
        let grade = new Grade({
          _category: category._id,
          _user: user._id,
          user_eval: {value: 5}
        })
        grade.save(() => {
          chai.request(server)
            .delete('/api/grade')
            .send({id: grade._id})
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.success.should.be.equal(true);
              res.body.should.have.property('message', 'Évaluation supprimée');
              done();
            });
        });
      });
    });

    describe('GET category/:id/grades', () => {
      it('should get a category grades', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let phase = new Phase({
          title: "Les bon films"
        });
        phase.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['Pas touche a grisby salope'],
          _phase: phase._id
        });
        category.save();
        let grade = new Grade({
          _category: category._id,
          _user: user._id,
          user_eval: {value: 5}
        })
        grade.save(() => {
          chai.request(server)
            .get('/api/category/' + category._id + '/grades')
            .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.should.be.an.Array;
              res.body.length.should.be.equal(1);
              done();
            });
        });
      });
    });

    describe('PATCH grade', () => {
      it('should patch a specific grade', (done) => {
        let user = new User({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        let phase = new Phase({
          title: "Les bon films"
        });
        phase.save();
        let category = new Category({
          title: 'Tonton flingeur',
          skills: ['Pas touche a grisby salope'],
          _phase: phase._id
        });
        category.save();
        let grade = new Grade({
          _category: category._id,
          _user: user._id,
          user_eval: {value: 5}
        })
        grade.save(() => {
          chai.request(server)
            .patch('/api/grade')
            .send({id: grade._id, user_eval: {value: 4}, validator_eval: {value: 3}, _validator: user._id})
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
