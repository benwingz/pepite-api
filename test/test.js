const chai = require('chai');
const chaiHttp = require('chai-http');
process.env.ENV = 'TEST';
const server = require('../server');
const should = chai.should;

const usertest = require('./models/user');
const phasetest = require('./models/phase');
const categorytest = require('./models/category');
const commenttest = require('./models/comment');
const gradetest = require('./models/grade');

const integrationUser = require('./endpoints/user');
const integrationPhase = require('./endpoints/phase');
const integrationGrade = require('./endpoints/grade');
const integrationComment = require('./endpoints/comment');

let token;

usertest.test();
phasetest.test();
categorytest.test();
commenttest.test();
gradetest.test();

describe('POST authenticate', () => {
  it('should get the authentication token', (done) => {
    let user = {
      firstname: 'test',
      lastname: 'test',
      email: 'test@test.com',
      password: 'thisisatest'
    }
    chai.request(server)
      .post('/api/authenticate')
      .send(user)
      .end((err, res) => {
        token = res.body.token;
        integrationUser.test(token);
        integrationPhase.test();
        integrationGrade.test(token);
        integrationComment.test(token);
        done();
      });
  });
});
