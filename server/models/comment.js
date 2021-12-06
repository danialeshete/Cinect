var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema(
  {
    //_id: {type: mongoose.Types.ObjectId},
    owner: {type: String, required: true}, //String to refer to auth0 user_id
    personal_rating: {type: Number, default: 0},
    reffered_media: {type: Number, required: true},
    content: {type: String, maxLength: 300},
    is_review: {type: Boolean, default: false},
    reply_count:{type: Number, default: 0},
    replies: [{type: mongoose.Types.ObjectId, ref: 'Reply'}],
  }
);

//Export model
module.exports = mongoose.model('Comment', CommentSchema);