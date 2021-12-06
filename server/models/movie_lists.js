var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieListSchema = new mongoose.Schema(
  {
    //_id: {type: mongoose.Types.ObjectId},
    owner: {type: String, required: true},
    top_10_movies: [{type: Number}],
    top_10_series: [{type: Number}],
    watched_by_friends: [{type: Number}],
    commented_by_friends: [{type: Number}],
    most_talked_about: [{type: Number}],
    dissapointments: [{type: Number}],
  }
);

//Export model
module.exports = mongoose.model('MovieLists', MovieListSchema);