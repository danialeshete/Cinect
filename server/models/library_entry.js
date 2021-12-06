var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LibraryEntrySchema = new Schema(
  {
   // _id: {type: mongoose.Types.ObjectId},
    movie: {type: Number, required: true},
    personal_rating: {type: Number, default: 0},
    watchlist: {type: Boolean, default: false},
    watched: {type: Boolean, default: false},
    tags: [{type: String}],
  }
);

module.exports = mongoose.model('LibraryEntry', LibraryEntrySchema);

