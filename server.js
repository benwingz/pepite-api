var express = require('express');
var app = express();
var morgan = require('morgan');

var port = process.env.PORT || 8080;

app.use(morgan('dev'));

require('./routes')(app);

var server = app.listen(port);
console.log('Pepite API is up at http://localhost/' + port + '/api/');

module.exports = server;
