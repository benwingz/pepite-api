var chai = require('chai');
var chaiHttp = require('chai-http');
process.env.ENV = 'TEST';
var server = require('../../server');
var should = chai.should;

var Phase = require('../../app/models/phase.model');
var Category = require('../../app/models/category.model')

chai.use(chaiHttp);

exports.test = function(){

  describe('Phase', function(){

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

    describe('GET phases', () => {
      it('should get all the phases when there is none', (done) => {
        chai.request(server)
          .get('/api/phases')
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.success.should.be.equal(false);
            res.body.message.should.be.equal('Aucune phase récupérable');
            done();
          });
      });
    });

    describe('GET phases', () => {
      it('should get all the phases when there is one', (done) => {
        let phase = new Phase({
          title: 'This is my phase'
        });
        phase.save();
        chai.request(server)
          .get('/api/phases')
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.should.be.an.Array;
            res.body.length.should.be.equal(1);
            done();
          });
      });
    });

    describe('GET phase/:id/categories', () => {
      it('should all categories for a phase', (done) => {
        let phase = new Phase({
          title: 'This is my phase'
        });
        phase.save();

        let category = new Category ({
          title: 'This is my category',
          skills: ['Have a lot of skills'],
          _phase: phase._id
        });
        category.save();

        chai.request(server)
          .get('/api/phase/' + phase._id + '/categories')
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.should.be.an.Array;
            res.body.length.should.be.equal(1);
            res.body[0].title.should.be.equal('This is my category');
            res.body[0].skills.should.be.an.Array;
            res.body[0].skills.length.should.be.equal(1);
            res.body[0].skills[0].should.be.equal('Have a lot of skills');
            done();
          });
      });
    });

  })
}
