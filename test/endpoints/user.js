const chai = require('chai');
const chaiHttp = require('chai-http');
process.env.ENV = 'TEST';
const server = require('../../server');
const should = chai.should;

var User = require('../../app/models/user.model');
chai.use(chaiHttp);

exports.test = function(token){

  describe('Users', function(){

    beforeEach((done) => {
      User.remove({}, done);
    });

    describe('GET users', () => {
      it('should get all the users when there is not', (done) => {
        chai.request(server)
          .get('/api/users')
          .set('authorization', 'Bearer ' + token)
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.should.be.an.Array;
            res.body.length.should.be.equal(0);
            done();
          });
      });
    });

    describe('POST user', () => {
      it('it should post user', (done) => {
        let user = {
          firstname: 'Lino',
          lastname: 'Ventura',
          email: 'lino.ventura@tonton.gun',
          password: 'TouchePasAuGrisby'
        }
        chai.request(server)
          .post('/api/user')
          .set('authorization', 'Bearer ' + token)
          .send(user)
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.success.should.be.equal(true);
            res.body.should.have.property('message', 'Utilisateur enregistré');
            done()
          });
      })
    });

    describe('GET users', () => {
      it('should get all the users when there is one', (done) => {
        let user = new User ({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        chai.request(server)
          .get('/api/users')
          .set('authorization', 'Bearer ' + token)
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.should.be.an.Array;
            res.body.length.should.be.equal(1);
            done();
          });
      });
    });

    describe('GET user/:id', () => {
      it('should get a specific users', (done) => {
        let user = new User ({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        chai.request(server)
          .get('/api/user/' + user._id)
          .set('authorization', 'Bearer ' + token)
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.firstname.should.be.equal('Lino');
            res.body.lastname.should.be.equal('Ventura');
            done();
          });
      });
    });

    describe('DELETE user', () => {
      it('should delete a specific users', (done) => {
        let user = new User ({
          firstname: 'Lino',
          lastname: 'Ventura'
        });
        user.save();
        chai.request(server)
          .delete('/api/user')
          .set('authorization', 'Bearer ' + token)
          .send({id: user._id})
          .end((err, res) => {
            res.should.have.property('status', 200);
            res.body.success.should.be.equal(true);
            res.body.should.have.property('message', 'Utilsateur supprimé');
            done();
          });
      });
    });

  })
}
