const express = require('express');
const check_jwt = require("../auth/check-jwt");
const username_router = express.Router();
const router = express.Router({ mergeParams: true });

const UserProfile = require('../models/user_profile');
const LibraryEntry = require('../models/library_entry');

const { maintain_media_rating, validate_media_id } = require('./common');

//const { pipeline, Stream } = require('stream');
const path = require('path');

const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        files: 1,
        fileSize: 3 * 1000 * 1000
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png') { cb(null, true); }
        cb(null, false); // reject
    }
});

// https://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router
// Passing data through middlewares: https://stackoverflow.com/a/38355597

router.use(async function (req, res, next) {
    console.log(`Get User Document for ${res.locals.username}`);
    const username = res.locals.username;
    const user_doc = await UserProfile
        .findOne({ username: username })
        .exec();

    if (!user_doc) {
        res.status(404).send(`User "${username}" not found.`);
        return;
    }

    res.locals.db_user_doc = user_doc;
    next();
});

router.get('/profile', async function (req, res, next) {
    const username = res.locals.username;

    let query = UserProfile
        .findOne({ username: username })
        .select({ _id: 0, __v: 0, picture: 0 })
        .populate('friends', { _id: 0, username: 1, user_description: 1 })
        .populate({
            path: 'library',
            select: { _id: 0, __v: 0 },
            options: {
                sort: {_id: -1}
            }
        });

    if (!("library" in req.query)) {
        query = query.select({ library: 0 });
    }

    const user_doc = await query.exec();
    console.log(req.query);
    if (!user_doc) {
        res.status(404).send(`User "${username}" not found.`);
        return;
    }

    res.json(user_doc.toJSON());
});


router.put('/profile/friends', async function (req, res, next) {
    if (!res.locals.authenticated) { return res.status(401).send(""); }
    const username = res.locals.username;
    const friend = String(req.query.username);
    const user_doc = res.locals.db_user_doc;

    let friend_doc = await UserProfile.findOne({ username: friend }).exec();

    if (!friend_doc) { return res.status(404).send(`Friend "${friend}" not found.`); }

    if (!user_doc.friends.includes(friend_doc._id)) {
        user_doc.friends.push(friend_doc._id);
    }
    await user_doc.save();

    return res.send("Friend added");
});

router.delete('/profile/friends', async function (req, res, next) {
    if (!res.locals.authenticated) { return res.status(401).send(""); }
    const username = res.locals.username;
    const friend = String(req.query.username);
    const user_doc = res.locals.db_user_doc;

    let friend_doc = await UserProfile.findOne({ username: friend }).exec();

    if (!friend_doc) { return res.status(404).send(`Friend "${friend}" not found.`); }

    await user_doc.friends.pull(friend_doc._id);
    await user_doc.save();

    return res.send("Friend deleted");
});

router.put('/profile', async function (req, res, next) {
    if (!res.locals.authenticated) { return res.status(401).send(""); }
    const username = res.locals.username;
    const new_username = req.body.username;
    const new_user_description = req.body.user_description;

    let user = await UserProfile.findOne({ username: username }).exec();

    if (!user) {
        res.status(404).send(`User "${username}" not found.`);
        return;
    }

    if (new_username) {
        try {
            user.username = new_username;
            await user.save();
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return res.status(422).send('User already exists!');
            }
            return res.status(422).send(error);
        }
    }

    if (new_user_description) {
        user.user_description = new_user_description;
        await user.save();
    }

    return res.send("Saved");
});

router.get('/library', async function (req, res, next) {
    const username = res.locals.username;

    const default_selection = { _id: 0, __v: 0 };
    const user_doc = await UserProfile
        .findOne({ username: username })
        .select(default_selection)
        .populate({
            path: 'library',
            select: default_selection,
            options: {
                sort: {_id: -1}
            }
        })
        .exec();

    if (!user_doc) {
        res.status(404).send(`User "${username}" not found.`);
        return;
    }

    res.json(user_doc.toJSON().library);
});

const get_libraryentry_doc = async function (user_doc, media_id, media_is_tv) {
    console.log("QUERY ",{ media_id: media_id, is_tv: media_is_tv });
    await user_doc.populate({
        path  : 'library',
        match : { media_id: media_id, is_tv: media_is_tv }
    });
    const entry_found = user_doc.library.length > 0;
    //console.log(user_doc);
    //console.log("entry_found", entry_found);
    if (entry_found) {
        return user_doc.library[0];
    }
    return undefined;
};

router.get('/library/entry/:media_id', validate_media_id, async function (req, res, next) {
    const media_id = parseInt(req.params.media_id);
    const media_is_tv = req.query.is_tv === 'true';

    let entry_doc = await get_libraryentry_doc(res.locals.db_user_doc, media_id, media_is_tv);

    if (!entry_doc) {
        res.status(404).json({});
        return;
    }

    res.json(entry_doc.toJSON());
});

router.put('/library/entry/:media_id', validate_media_id, async function (req, res, next) {
    const username = res.locals.username;
    const media_id = parseInt(req.params.media_id);
    const media_is_tv = req.query.is_tv === 'true';
    const user_doc = res.locals.db_user_doc;

    let entry_doc = await get_libraryentry_doc(res.locals.db_user_doc, media_id, media_is_tv);

    if (!entry_doc) {
        const new_library_entry = async function (spec) {
            let handle = new LibraryEntry(spec);
            handle = await handle.save();
            console.log('New LibraryEntry: ' + handle);
            return handle;
        };

        entry_doc = await new_library_entry({ media_id: media_id, is_tv: media_is_tv });

        user_doc.library.push(entry_doc._id);
        await user_doc.save();
    }

    console.log(entry_doc);
    if (entry_doc) {
        console.log('Setting values');
        entry_doc.set(req.body);
        await entry_doc.save();
    }
    
    maintain_media_rating(user_doc._id, media_id, media_is_tv);

    res.status(200).send("Updated");
});

router.delete('/library/entry/:media_id', validate_media_id, async function (req, res, next) {
    const username = res.locals.username;
    const media_id = parseInt(req.params.media_id);
    const media_is_tv = req.query.is_tv === 'true';
    const user_doc = res.locals.db_user_doc;

    const entry_doc = await get_libraryentry_doc(res.locals.db_user_doc, media_id, media_is_tv);

    console.log(entry_doc);
    if (entry_doc) {
        console.log('Pulling _id', entry_doc._id);
        await user_doc.library.pull(entry_doc._id);
        await user_doc.save();
        await entry_doc.remove();
    }
    
    maintain_media_rating(user_doc._id, media_id, media_is_tv);

    res.status(200).send("Deleted");
});

router.get('/picture', async function (req, res, next) {
    // Note: Buffer to ReadableStream: https://stackoverflow.com/a/62143160
    // Get from db
    const user_doc = res.locals.db_user_doc;
    if (user_doc.picture) {
        res.type('png').send(user_doc.picture);
        return;
    }

    // if not in db serve default:
    res.sendFile('./img/anonymous.png', {root: path.join(__dirname, '../public')});
});

router.post('/picture', upload.single('picture'), async function (req, res, next) {
    const user_doc = res.locals.db_user_doc;
    const img_file = req.file;
    if (!img_file) {
        res.status(400).send("Please send a single file of type image/png");
        return;
    }
    user_doc.picture = img_file.buffer;
    await user_doc.save();
    res.send("Picture updated.");
});

router.get('/confidential', check_jwt, function (req, res, next) {
    res.json(`Hello ${res.locals.username}! Your JWT is legit!`);
});


const to_username = function (req, res, next) {
    res.locals.username = req.params.username;
    next();
};


const random_username = function () {
    const choose = function (choices) {
        var index = Math.floor(Math.random() * choices.length);
        return choices[index];
    };
    const words = ["Cherry", "Pomme", "Apple", "Apricots", "Avocado", "Banana", "Blackberry", "Blackcurrant", "Blueberry", "Breadfruit", "Cantaloupe", "Carambola", "Cherimoya", "Cherries", "Clementine", "Coconut Meat", "Cranberry", "CustardApple", "DateFruit", "Durian", "Elderberry", "Feijoa", "Figs", "Gooseberry", "Grapefruit", "Grapes", "Guava", "HoneydewMelon", "Jackfruit", "JavaPlum", "JujubeFruit", "Kiwifruit", "Kumquat", "Lemon", "Lime", "Longan", "Loquat", "Lychee", "Mandarin", "Mango", "Mangosteen", "Mulberries", "Nectarine", "Olives", "Orange", "Papaya", "PassionFruit", "Peaches", "Pear", "Persimmon", "Pitaya", "Dragonfruit", "Pineapple", "Pitanga", "Plantain", "Plums", "Pomegranate", "PricklyPear", "Prunes", "Pummelo", "Quince", "Raspberries", "Rhubarb", "RoseApple", "Sapodilla", "Sapote", "Mamey", "Soursop", "Strawberries", "SugarApple", "Tamarind", "Tangerine", "Watermelon"]
    const random_int = Math.floor(Math.random() * 99) + 1;
    return choose(words) + random_int.toString();
}

const jwt_to_username = async function (req, res, next) {
    res.locals.authenticated = true;
    const user_id = req.user.sub; 
    const user_doc = await UserProfile
        .findOne({ _id: user_id })
        .select({ username: 1 })
        .exec();

    if (user_doc) {
        res.locals.username = user_doc.username;
    } else {
        const MAX_TRIES = 50;
        let i = 0;
        while (true) {
            i++;
            if (i > MAX_TRIES) { res.status(500).json({err: "Could not generate a username."}) }
            const username_candidate = random_username();
            try {
                let handle = new UserProfile({ _id: user_id, username: username_candidate });
                handle = await handle.save();
                res.locals.username = handle.username;
                break;
            } catch (err) {
                if (err.code === '11000') {
                    /* already exists */
                } else {
                    throw err;
                }
            }

        }
    }
    next();
};

username_router.get('/debug', function (req, res, next) {
    res.send("This is username_router /debug");
});

username_router.use("/me", check_jwt, jwt_to_username, router);
username_router.use("/:username", to_username, router);

module.exports = username_router;
