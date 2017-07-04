//Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Grade', new Schema({
  _category: {
    type: Schema.Types.ObjectId,
    ref:'Category'
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  _validator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user_eval: {
    value: Number,
    date: Date
  },
  validator_eval: {
    value: Number,
    date: Date
  },
  created_at: Date,
  updated_at: Date
}));
