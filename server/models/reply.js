var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const options = { toJSON: { virtuals: true } };

var ReplySchema = new mongoose.Schema(
  {
    owner: {type: String, required: true, ref: 'UserProfile'},
    personal_rating: {type: Number, default: 0},
    content: {type: String, maxLength: 300, required: true},
    referred_media: {type: Number, required: true},
    is_tv: {type: Boolean, default: false, required: true},
  },
  options
);

ReplySchema.virtual('created').get( function () {
  if (this["_created"]) return this["_created"];
  return this["_created"] = this._id.getTimestamp();
});

//Export model
module.exports = mongoose.model('Reply', ReplySchema);