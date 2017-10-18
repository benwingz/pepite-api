module.exports = {

  'DEV': {
    'secret': 'jwtsecretdev',
    'database': "localhost:27017/local"
  },
  'TEST': {
    'secret': 'jwtsecretdtest',
    'database': "localhost:27017/test"
  },
  'PROD': {
      'secret': 'jwtsecretdev',
      'database': 'mongodb://pepite:pepite2017@ds123695.mlab.com:23695/heroku_lmdf0553'
  }

};
