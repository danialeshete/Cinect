var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserProfileSchema = new mongoose.Schema(
  {
    _id: {type: String}, // auth0 user_id
    //user_id: {type: String, required: true, index: true, unique: true}, //auth0 user_id
    username: {type: String, required: true, index: true, unique: true, maxLength: 100},
    // profile_picture: {type: Buffer},
    // profile_picture_type: {type: String},
    user_description: {type: String, maxLength: 450},
    friends: [{type: String, ref: 'UserProfile'}],
    library: [{type: mongoose.Types.ObjectId, ref: 'LibraryEntry'}],
    picture: Buffer,
  }
);



//to retrieve profile picture according to Youtube guy:
// UserProfileSchema.virtual('imgSrc').get(function (){
//   if(this.profile_picture != null && this.profile_picture_type != null){
//     return `data:${this.profile_picture_type};charset=utf-8;base64,${this.profile_picture.toString(base64)}`
//   }
// });


//Export model
module.exports = mongoose.model('UserProfile', UserProfileSchema);



//********************************************************************//
//********************Profile Picture Stuff***************************//
//********************************************************************//


//Source: https://www.youtube.com/watch?v=1dydfuNQMg4&ab_channel=TheFreakLesson
/* 
 - Data Type used is Buffer
 - uploaded img has to be converted, s. example function 'saveImage' below
 - images are then stored as Binary Data
 - to retrive the image you have to use the virtual 

*/



// //Array for accepted image types
// const imageTypes = ['image/jpeg', 'image/png'];

// //takes file and converts it to Binary file and sets it for the given Userprofile
// function saveImage(UserProfile, imgEncoded){
//   if(imgEncoded == null) return;
//   const img = JSON.parse(imgEncoded);

//   if(img != null && imageTypes.ingludes(img.type)){
//     //from the Youtube guy:
//     //Userprofile.profile_picture = new Buffer.from(img.data, 'base64');
//     //Userproffile.profile_picture_type = img.type; 

//     //for us probably:
//     UserProfile.updateOne({ _id: UserProfile._id }, {profile_picture: new Buffer.from(img.data, 'base64')}, {profile_picture_type: img.type});
//   }
// }

