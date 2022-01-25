#! /usr/bin/env node
var mongoose = require('mongoose');
var UserProfile = require('./models/user_profile');
var LibraryEntry = require('./models/library_entry');
var Comment = require('./models/comment');
var Reply = require('./models/reply');

const uri = process.env.MONGO_URI || "mongodb://root:ws21@localhost/admin";

mongoose.connect(uri, {
    dbName: "cinect",
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const fs = require('fs');
const comment = require('./models/comment');

const populate = async function () {
    await db.dropDatabase();

    //create users
    console.log('before elsa');
    var elsa = new UserProfile({
        _id: "auth0|61b7595075059500718f79d1",
        username: "elsa123",
        user_description: "Spiderman is not Batman!"
    });
    console.log('before elsa save' + elsa);
    elsa = await elsa.save();
    console.log('New User: ' + elsa);

    var verena = new UserProfile({
        _id: "auth0|619f8058889de0006a0219aa",
        username: "Verena",
        user_description: "„Wer überhaupt nichts von der Existenz einer Hölle weiß, läuft auch nicht Gefahr, dort zu schmoren. Was erklärt, warum es so wichtig ist, alle Missionare zu erschießen.“ — Terry Pratchett, buch Faust Eric"
    });


    verena = await verena.save();
    console.log('New User: ' + verena);

    var raphael = new UserProfile({
        _id:"auth0|619c18ed1b1a2e006904bd30",
        username: "Raphael",
        user_description: "„Gibt es irgendwas in der Welt, durch das unser Leben lebenswert wird?\" fragte Allesweiß bitter. Tod überlegte. KATZEN, sagte er schließlich. JA, KATZEN SIND RECHT NETT.\“ — Terry Pratchett, buch Der Zauberhut",
        picture: fs.readFileSync('./public/img/wave.png')
    });
    raphael = await raphael.save();
    console.log('New User: raphael');

    var laurent = new UserProfile({
        _id: "google-oauth2|101511080219519963299",
        username: "Laurent",
        user_description: "„Nach dem Philosophen Ly Schwatzmaul findet man immer dort besonders viel Chaos, wo man nach Ordnung sucht. Das Chaos besiegt die Ordnung, weil es besser organisiert ist.\“ — Terry Pratchett, buch Echt zauberhaft"

    });
    laurent = await laurent.save();
    console.log('New User: ' + laurent);

    var danial = new UserProfile({
        _id: "google-oauth2|111958069394869310962",
        username: "Danial",
        user_description: "„Ein weiterer Grund für die unbeschwerte Heiterkeit bestand darin, daß niemand versuchte, irgendwen umzubringen – ein in magischen Kreisen höchst ungewöhnlicher Zustand.\“ — Terry Pratchett, buch Der Zauberhut"
    });
    danial = await danial.save();
    console.log('New User: ' + danial);

    var sam = new UserProfile({
        _id: "auth0|001",
        username: "samsmovies",
        user_description: "i like movies"
    });
    sam = await sam.save();
    console.log('New User: ' + sam);

    var lisa = new UserProfile({
        _id: "auth0|002",
        username: "lisa",
        user_description: "i have been to australia!"
    });
    lisa = await lisa.save();
    console.log('New User: ' + lisa);

    //add some friends
    //here the auth0 ids need to be used in the future
    elsa.friends.push(lisa._id);
    sam.friends.push(elsa._id);
    lisa.friends.push(elsa._id, sam._id);
    verena.friends.push(raphael._id, laurent._id, danial._id, lisa._id);
    raphael.friends.push(verena._id, laurent._id, danial._id, lisa._id);
    laurent.friends.push(verena._id, raphael._id, danial._id, lisa._id);
    danial.friends.push(verena._id, raphael._id, laurent._id, lisa._id);

    //create library entries
    const new_library_entry = async function (spec) {
        let handle = new LibraryEntry(spec);
        handle = await handle.save();
        console.log('New LibraryEntry: ' + handle);
        return handle;
    };

    const new_comment_reply = async function (comment, reply_spec) {
        reply_spec.is_tv = comment.is_tv;
        reply_spec.referred_media = comment.referred_media;
        
        let handle = new Reply(reply_spec);
        handle = await handle.save();
        console.log('New Reply: ' + handle);
        return handle;
    };

    const dune = 438631;
    const jimknopf = 422742;
    const klaus = 508965;
    const BarbieBigCity = 850818;
    const BarbiePrincess = 738215;
    const BarbieThumbelina = 16418;
    const BarbieRapunzel = 15015;
    const BarbieMariposa = 18198;
    const Pirates1 = 1865;
    const Pirates2 = 285;
    const Pirates3 = 58;
    const Pirates4 = 166426;
    const Lotr1 = 121;
    const Lotr2 = 122;
    const Lotr3 = 123;
    const Harry1 = 671;
    const Harry2 = 767;
    const Harry3 = 674;
    const Harry4 = 672;
    const Harry5 = 673;
    const Harry6 = 12444;
    const Harry7 = 675;
    const Harry8 = 12445;
    const Suicide = 436969;
    const Bond = 370172;
    const Kong = 399566;
    const Pate = 238;
    const Chihiro = 129;
    const Parasite = 496243;
    const Pulp = 680;
    const Fight = 550;
    const WandelndesSchloss = 4935;
    const Interstellar = 157336;

    const TVWheelofTime = 71914;
    const TVBigBang = 1418;
    const TVHIMYM = 1100;
    const Arcane = 94605;
    const RickMorty = 60625;
    const Adventure = 15260;
    const Futurama = 615;
    const GoodOmens = 71915;





    //add some movies to the libraries
    elsa.library.push(
        (await new_library_entry({ media_id: jimknopf, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: dune    , personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: RickMorty, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Bond, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Kong, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Pate, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Suicide, personal_rating: 5, watched: true }))._id
    );
    sam.library.push(
        (await new_library_entry({ media_id: jimknopf, personal_rating: 2, watched: true }))._id,
        (await new_library_entry({ media_id: dune    , personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: klaus   , personal_rating: 1, watched: true }))._id,
        (await new_library_entry({ media_id: RickMorty, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Bond, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Kong, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Pate, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Suicide, personal_rating: 5, watched: true }))._id
    );
    lisa.library.push(
        (await new_library_entry({ media_id: jimknopf, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: klaus   , personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: RickMorty, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Bond, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Kong, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Pate, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Suicide, personal_rating: 5, watched: true }))._id
    );

    raphael.library.push(
        (await new_library_entry({ media_id: BarbieBigCity, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: BarbiePrincess, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: BarbieThumbelina, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: BarbieRapunzel, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: BarbieMariposa, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: TVBigBang, is_tv: true, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: TVHIMYM, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Lotr1, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Lotr2, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Lotr3, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Pirates1, personal_rating: 1, watched: true }))._id,
        (await new_library_entry({ media_id: RickMorty, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Bond, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Kong, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Pate, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Suicide, personal_rating: 5, watched: true }))._id
    );

    laurent.library.push(
        (await new_library_entry({ media_id: Pirates2, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Pirates3, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Pirates4, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry1, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: TVWheelofTime, is_tv: true, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: TVHIMYM, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Harry2, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Harry3, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Harry4, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry5, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry6, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry7, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry8, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Pirates1, personal_rating: 1, watched: true }))._id,
        (await new_library_entry({ media_id: Arcane, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Futurama, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: GoodOmens, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Interstellar, personal_rating: 3, watched: true }))._id
    );

    verena.library.push(
        (await new_library_entry({ media_id: Pirates2, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Pirates3, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Pirates4, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry1, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: TVWheelofTime, is_tv: true, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: TVHIMYM, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Harry2, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Harry3, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Harry4, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry5, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry6, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Harry7, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Harry8, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Pirates1, personal_rating: 1, watched: true }))._id,
        (await new_library_entry({ media_id: Chihiro, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: WandelndesSchloss, personal_rating: 1, watched: true }))._id
    );

    danial.library.push(
        (await new_library_entry({ media_id: Pate, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Interstellar, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Chihiro, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry1, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: TVBigBang, is_tv: true, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: TVHIMYM, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Harry2, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Harry3, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Harry4, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry5, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Harry6, personal_rating: 4, watched: true }))._id,
        (await new_library_entry({ media_id: Harry7, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Harry8, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Adventure, is_tv: true, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Parasite, personal_rating: 3, watched: true }))._id,
        (await new_library_entry({ media_id: Fight, personal_rating: 5, watched: true }))._id,
        (await new_library_entry({ media_id: Pulp, personal_rating: 1, watched: true }))._id
    );



    //Creating Comments

    var rootComment1 = new Comment({
        owner: verena._id,
        personal_rating: 4,
        referred_media: 422742,
        is_tv: false,
        content: "Für eine deutsche Produktion erstaunlich gute VFX, da war wohl endlich mal Geld da! Außerdem nice, dass sogar Kameraeinstellungen aus der Puppenkiste 1:1 übernommen wurden :)",
        is_review: true
    });
    rootComment1 = await rootComment1.save();
    console.log('New Comment: rootComment1');

    var rootComment2 = new Comment({
        owner: laurent._id,
        personal_rating: 3,
        referred_media: 12445,
        is_tv: false,
        content: "Also wenn man sich mal alle Harry Potter Filme anschaut, ist das schon sehr auffällig wie schlecht da manches gemacht ist. Hagrids Hütte steht gefühlt in jedem einzelnen Film wo anders, der verbotene Wald wechselt wohl jährlich seinen Abstand zum Schloss... da hätte man sich schon mal mehr Mühe geben können",
        is_review: false
    });
    rootComment2 = await rootComment2.save();
    console.log('New Comment: rootComment2');

    var rootComment3 = new Comment({
        owner: raphael._id,
        personal_rating: 5,
        referred_media: 18198,
        is_tv: false,
        content: "Egal was andere sagen, Bibel ist und bleibt der beste Sidekick den ein Film je gesehen hat!",
        is_review: true
    });
    rootComment3 = await rootComment3.save();
    console.log('New Comment: rootComment3');


    var rootComment4 = new Comment({
        owner: lisa._id,
        personal_rating: 3,
        referred_media: 121,
        is_tv: false,
        content: "Also I've been ja schon to Aurstralien and Neuseeland und ganz ehrlich, die haben sich ja schon Mühe gegeben aber actually ist die Natur da noch viel nicer! Ich weiß das, ich war ja there!",
        is_review: true
    });
    rootComment4 = await rootComment4.save();
    console.log('New Comment: rootComment4');

    var rootComment5 = new Comment({
        owner: danial._id,
        personal_rating: 5,
        referred_media: 438631,
        is_tv: false,
        content: "A cinematic masterpiece",
        is_review: false
    });
    rootComment5 = await rootComment5.save();
    console.log('New Comment: rootComment5');



    var rootComment6 = new Comment({
        owner: verena._id,
        personal_rating: 4,
        referred_media: 285,
        is_tv: false,
        content: "Ich will auch ein Glas voll Dreck.",
        is_review: true
    });
    rootComment6 = await rootComment6.save();
    console.log('New Comment: rootComment6');

    var rootComment7 = new Comment({
        owner: laurent._id,
        personal_rating: 3,
        referred_media: 94605,
        is_tv: true,
        content: "Einer der interessantesten Animationsstile die man seit Langem zu sehen bekommen hat. Da hat Netflix ausnahmsweise mal wieder was richtig gemacht!",
        is_review: false
    });
    rootComment7 = await rootComment7.save();
    console.log('New Comment: rootComment7');

    var rootComment8 = new Comment({
        owner: raphael._id,
        personal_rating: 2,
        referred_media: 370172,
        is_tv: false,
        content: "Es wird Zeit, dass Mr \"geschüttelt, nicht gerührt\" in Rente geht...",
        is_review: true
    });
    rootComment8 = await rootComment8.save();
    console.log('New Comment: rootComment8');


    var rootComment9 = new Comment({
        owner: lisa._id,
        personal_rating: 3,
        referred_media: 850818,
        is_tv: false,
        content: "Die alten Barbie Filme waren ja echt wesentlich better!",
        is_review: true
    });
    rootComment9 = await rootComment9.save();
    console.log('New Comment: rootComment9');

    var rootComment10 = new Comment({
        owner: danial._id,
        personal_rating: 3,
        referred_media: 15260,
        is_tv: true,
        content: "Wer die Lumpy Cloud Princess nicht ehrt, ist den Beemo nicht wert!",
        is_review: false
    });
    rootComment10 = await rootComment10.save();
    console.log('New Comment: rootComment10');

    //Adding Replies
    rootComment1.replies.push(
        (await new_comment_reply(rootComment1, { owner: raphael._id, personal_rating: 1, content: "Was ne kacke, die Kinder könnten ruhig mal was lernen, verzogene Gören, Go Frau Mahlzahn!!!" }))._id,
        (await new_comment_reply(rootComment1, { owner: verena._id, personal_rating: 4, content: "Häää, also bevor Frau Mahlzahn ein goldener Drache wird kann man die wirklich nicht gut finden" }))._id,
        (await new_comment_reply(rootComment1, { owner: raphael._id, personal_rating: 1, content: "Sowas kann nur von einem Millenial kommen" }))._id,
        (await new_comment_reply(rootComment1, { owner: verena._id, personal_rating: 4, content: "Immer diese Boomer!" }))._id,
    );
    await Comment.updateOne({ _id: rootComment1._id }, {reply_count: 4});

    rootComment2.replies.push(
        (await new_comment_reply(rootComment2, { owner: danial._id, personal_rating: 5, content: "Egal wo Hagrids Hütte steht oder der verbotene Wald hingewachsen ist, Harry Potter bleibt großartig (JK Rowling nicht)." }))._id,
        (await new_comment_reply(rootComment2, { owner: laurent._id, personal_rating: 3, content: "Was die Frau von sich gibt ist fragwürdig, trotzdem hat HP Generationen geprägt..." }))._id,
        
    );
    await Comment.updateOne({ _id: rootComment2._id }, {reply_count: 2});

    rootComment4.replies.push(
        (await new_comment_reply(rootComment4, { owner: verena._id, content: "Schon bedauerlich wenn man nach 2 Wochen die eigene Sprache nicht mehr kann XD" }))._id,
        (await new_comment_reply(rootComment4, { owner: raphael._id, content: "Klassische Lisa" }))._id,
        (await new_comment_reply(rootComment4, { owner: danial._id, content: "Immer noch besser als Karens!" }))._id,
        (await new_comment_reply(rootComment4, { owner: laurent._id, content: "Aber genauso anstrengend wie Veganer" }))._id,
        (await new_comment_reply(rootComment4, { owner: danial._id, content: "lol" }))._id,

    );
    await Comment.updateOne({ _id: rootComment4._id }, {reply_count: 5});

    rootComment5.replies.push(
        (await new_comment_reply(rootComment5, { owner: laurent._id, content: "Wird interessant wie der zweite Teil wird" }))._id,
        (await new_comment_reply(rootComment5, { owner: verena._id, content: "Man kann nur hoffen, dass die Reihe nicht nach dem Erfolg des ersten Teils komplett ausgeschlachtet wird" }))._id,
        (await new_comment_reply(rootComment5, { owner: danial._id, content: "Das wäre sofort das Ende der Reihe..." }))._id,

    );
    await Comment.updateOne({ _id: rootComment5._id }, {reply_count: 3});

    rootComment9.replies.push(
        (await new_comment_reply(rootComment9, { owner: raphael._id, personal_rating: 5, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua" }))._id,
        (await new_comment_reply(rootComment9, { owner: raphael._id, personal_rating: 5, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua" }))._id,
        (await new_comment_reply(rootComment9, { owner: raphael._id, personal_rating: 5, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua" }))._id,

    );
    await Comment.updateOne({ _id: rootComment9._id }, {reply_count: 3});

    rootComment10.replies.push(
        (await new_comment_reply(rootComment10, { owner: raphael._id, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eo" }))._id,
        (await new_comment_reply(rootComment10, { owner: verena._id, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eo" }))._id,
        (await new_comment_reply(rootComment10, { owner: laurent._id, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eo" }))._id,
        (await new_comment_reply(rootComment10, { owner: danial._id, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eo" }))._id,
        (await new_comment_reply(rootComment10, { owner: raphael._id, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eo" }))._id,
        (await new_comment_reply(rootComment10, { owner: lisa._id, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eo" }))._id,
        (await new_comment_reply(rootComment10, { owner: danial._id, content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eo" }))._id,


    );
    await Comment.updateOne({ _id: rootComment10._id }, {reply_count: 7});


    await elsa.save();
    await sam.save();
    await lisa.save();
    await raphael.save();
    await laurent.save();
    await verena.save();
    await danial.save();

    await rootComment1.save();
    await rootComment2.save();
    await rootComment3.save();
    await rootComment4.save();
    await rootComment5.save();
    await rootComment6.save();
    await rootComment7.save();
    await rootComment8.save();
    await rootComment9.save();
    await rootComment10.save();

    console.log("Done Populating")
};

const query = async function () {  
    // const { maintain_media_rating } = require("./routes/common");

    // maintain_media_rating("")
    
    return;
    // filter an array of references: https://stackoverflow.com/a/36371665
    let user_doc = await UserProfile
        .findOne({username: 'lisa'})
        .exec();
    
    if (!user_doc) {
        console.log("User not found");
        return;
    }
    console.log(user_doc);

    let cdoc = await user_doc
        .populate({
            path  : 'library',
            match : { media_id: 422742, is_tv: false }
        });

    console.log(user_doc);

    user_doc.library[0].set({
        personal_rating: 4,
        watched: false,
        is_tv: true
    });
    await user_doc.library[0].save();

    return;

    // write to referenced document
    if (user_doc) {
        if (user_doc.library.length > 0) {
            user_doc.library[0].personal_rating = 123;
            await user_doc.library[0].save();
        }
    }
    
    console.log(user_doc.library.length);

    //a = await UserProfile.updateOne

    return;

    // -----

    let user = await UserProfile.findOne() // query first match
        .select({ _id: 0, __v: 0 }) // de/select fields
        .exec(); // return real Promise

    console.log(user.toJSON());

    // "join" via populate() // https://mongoosejs.com/docs/api/query.html#query_Query-populate
    console.log("--------------------");
    const default_selection = { library:0, __v:0, _id:0 };
    user = await UserProfile
        .findOne({ username: "lisa" })
        .select(default_selection)
        .populate('friends', { username:1, _id:0 })
        .exec();

    console.log(user)

    // to JSON // https://mongoosejs.com/docs/api.html#document_Document-toJSON
    let json_str = JSON.stringify(user.toJSON());

    console.log("Type of json_str", typeof json_str);
    console.log("json_str", json_str);
};

const main = async function () {
    await populate();
    // await query();
    process.exit();
};

main();
