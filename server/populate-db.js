#! /usr/bin/env node
var mongoose = require('mongoose');
var UserProfile = require('./models/user_profile');
var LibraryEntry = require('./models/library_entry');
mongoose.connect("mongodb://localhost:27017/", {
    user: "root",
    pass: "ws21",
    dbName: "cinect",
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const populate = async function () {
    //create users
    console.log('before elsa');
    var elsa = new UserProfile({ user_name: "elsa123" })
    console.log('before elsa save' + elsa);
    elsa = await elsa.save();
    console.log('New User: ' + elsa);

    var sam = new UserProfile({ user_name: "samsmovies", user_description: "i like movies" })
    sam = await sam.save();
    console.log('New User: ' + sam);

    var lisa = new UserProfile({ user_name: "lisa", user_description: "i have been to australia!" })
    lisa = await lisa.save();
    console.log('New User: ' + lisa);

    //create library entries
    var dune = new LibraryEntry({ movie: 438631, personal_rating: 9, watchlist: false, watched: true })
    dune = await dune.save();
    console.log('New LibraryEntry: ' + dune);

    var jimknopf = new LibraryEntry({ movie: 422742, personal_rating: 8, watchlist: false, watched: true })
    jimknopf = await jimknopf.save();
    console.log('New LibraryEntry: ' + jimknopf);

    var klaus = new LibraryEntry({ movie: 508965, personal_rating: 8, watchlist: true, watched: false })
    klaus = await klaus.save();
    console.log('New LibraryEntry: ' + klaus);

    //add some friends
    //here the auth0 ids need to be used in the future
    elsa.friends.push(lisa._id);
    sam.friends.push(elsa._id);
    lisa.friends.push(elsa._id, sam._id);

    //add some movies to the libraries
    elsa.library.push(jimknopf._id, dune._id);
    sam.library.push(jimknopf._id, dune._id, klaus._id);
    lisa.library.push(jimknopf._id, klaus._id);

    await elsa.save();
    await sam.save();
    await lisa.save();

    console.log("Done")
    process.exit();
};

const query = async function () {
    let user = await UserProfile.findOne() // query first match
    .select({_id:0}) // de/select fields
    .exec(); // return real Promise

    console.log(user.toJSON());
    process.exit();
};

//populate();
query();