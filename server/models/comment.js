var mongoose = require('mongoose');
// var UserProfile = require('./user_profile');

var Schema = mongoose.Schema;

const options = { toJSON: { virtuals: true } };

var CommentSchema = new mongoose.Schema(
  {
    //_id: {type: mongoose.Types.ObjectId},
    owner: {type: String, required: true, ref: 'UserProfile'}, //String to refer to auth0 user_id
    personal_rating: {type: Number, default: 0},
    referred_media: {type: Number, required: true},
    is_tv: {type: Boolean, default: false, required: true},
    content: {type: String, maxLength: 600, required: true},
    is_review: {type: Boolean, default: false},
    reply_count:{type: Number, default: 0},
    replies: [{type: mongoose.Types.ObjectId, ref: 'Reply'}],
  },
  options
);

CommentSchema.virtual('created').get( function () {
  if (this["_created"]) return this["_created"];
  return this["_created"] = this._id.getTimestamp();
});

//Export model
module.exports = mongoose.model('Comment', CommentSchema);