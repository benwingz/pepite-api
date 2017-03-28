var usertest = require('./models/user');
var phasetest = require('./models/phase');
var categorytest = require('./models/category');
var commenttest = require('./models/comment');
var gradetest = require('./models/grade');

var integrationUser = require('./endpoints/user');
var integrationPhase = require('./endpoints/phase');
var integrationGrade = require('./endpoints/grade');

var User = require('../app/models/user.model');

usertest.test();
phasetest.test();
categorytest.test();
commenttest.test();
gradetest.test();

integrationUser.test();
integrationPhase.test();
integrationGrade.test();
