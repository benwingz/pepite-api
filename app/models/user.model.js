//Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  firstname: String,
  lastname: String,
  email: String,
  type: String,
  _pepite: {
    type: Schema.Types.ObjectId,
    ref: 'Pepite'
  },
  _validator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  password: String,
  salt: String,
  gender: String,
  birthdate: Date,
  ine: String,
  studyLevel: Number,
  studyType: String,
  address: String,
  cp: Number,
  town: String,
  country: String,
  phone: String,
  school: String,
  schoolType: String,
  project: String,
  certified: Boolean,
  created_at: Date,
  updated_at: Date,
  last_login_at: Date,
  otheremail: String
}));
