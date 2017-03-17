//Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Phase', new Schema({
  title: String,
  categories: [
    {
      category: {
        type: Schema.Types.ObjectId,
        ref:'Category'
      }
    }
  ]
}));
