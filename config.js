module.exports = {

  'DEV': {
    'secret': process.env.JWT_SECRET,
    'database': "localhost:27017/local"
  },
  'TEST': {
    'secret': process.env.JWT_SECRET,
    'database': "localhost:27017/test"
  }

};
