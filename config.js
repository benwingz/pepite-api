module.exports = {

  'DEV': {
    'secret': 'jwtsecretdev',
    'database': "localhost:27017/local"
  },
  'TEST': {
    'secret': 'jwtsecretdtest',
    'database': "localhost:27017/test"
  }
  'PROD': {
      'secret': 'jwtsecretdev',
      'database': "localhost:27017/local"
  }

};
