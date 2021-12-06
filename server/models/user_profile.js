var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserProfileSchema = new mongoose.Schema(
  {
    //_id: {type: mongoose.Types.ObjectId},
    user_id: {type: String}, //auth0 user_id
    user_name: {type: String, required: true, maxLength: 100},
    profile_picture: {type: String},
    user_description: {type: String, maxLength: 450},
    friends: [{type: String, ref: 'UserProfile'}],
    library:[{type: mongoose.Types.ObjectId, ref:'LibraryEntry'}],
  }
);

//Export model
module.exports = mongoose.model('UserProfile', UserProfileSchema);