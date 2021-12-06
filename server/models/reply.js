var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReplySchema = new mongoose.Schema(
  {
    //_id: {type: mongoose.Types.ObjectId},
    owner: {type: String, required: true},
    personal_rating: {type: Number, default: 0},
    content: {type: String, maxLength: 300},
  }
);

//Export model
module.exports = mongoose.model('Reply', ReplySchema);