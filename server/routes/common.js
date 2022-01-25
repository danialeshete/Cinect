const mongoose = require('mongoose');
const UserProfile = require('../models/user_profile');
const LibraryEntry = require('../models/library_entry');
const Comment = require('../models/comment');
const Reply = require('../models/reply');

const maintain_media_rating = async function (user_id, media_id, is_tv) {
    const user = await UserProfile
        .findById(user_id)
        .select({ library: 1 })
        .populate({
            path: 'library',
            match: {media_id: media_id}
        })
        .exec();

    const library = user.library;
    let rating = 0;

    if (library.length > 0) {
        const entry = library[0]
        rating = entry.personal_rating;
    }

    const query_criteria = {
        referred_media: media_id,
        is_tv: is_tv,
        owner: user_id
    };

    await Comment
    .updateMany(query_criteria, {
        $set: {personal_rating: rating}
    });

    await Reply
    .updateMany(query_criteria, {
        $set: {personal_rating: rating}
    });

    /** async iteration https://stackoverflow.com/a/68579393 */
};

const validate_media_id = function (req, res, next) {
    const media_id = parseInt(req.params.media_id);
    const is_valid = typeof media_id === 'number' && media_id >= 0;
    if (!is_valid) {
        return res.status(400).send("Invalid Media ID");
    }
    return next();
};

const validate_object_id = function (get_obj_id_func) {
    return async function (req, res, next) {
        const object_id = get_obj_id_func(req, res);
        if (mongoose.Types.ObjectId.isValid(object_id)) {
            return next();
        }
        return next(new Error("INVALID_OBJECT_ID"));
    };
};

const get_user_doc = async function (username) {
    const user_doc = await UserProfile
        .findOne({ username: username })
        .exec();
    
    if (!user_doc) {
        throw new Error('USER_NOT_FOUND');
    }

    return user_doc;
}

module.exports = { maintain_media_rating, validate_media_id, get_user_doc, validate_object_id };