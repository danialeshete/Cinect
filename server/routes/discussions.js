const express = require('express');
const check_jwt = require("../auth/check-jwt");

const router = express.Router({ mergeParams: true });

const UserProfile = require('../models/user_profile');
const LibraryEntry = require('../models/library_entry');
const Comment = require('../models/comment');
const Reply = require('../models/reply');

const { maintain_media_rating, validate_media_id, get_user_doc, validate_object_id: validate_obj_id } = require('./common');

// https://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router
// Passing data through middlewares: https://stackoverflow.com/a/38355597


const jwt_to_username = async function (req, res, next) {
    res.locals.authenticated = true;
    const user_id = req.user.sub; 
    res.locals.user_id = user_id

    const user_doc = await UserProfile
        .findOne({ _id: user_id })
        .select({ username: 1 })
        .exec();

    if (!user_doc) {
        res.status(404).send("User not found");
        return;
    }

    res.locals.username = user_doc.username;
    next()
}

const validate_comment_id = validate_obj_id(req => req.query.comment_id);
const validate_reply_id = validate_obj_id(req => req.query.reply_id);

router.get('/comment/medium/:media_id', validate_media_id, async function (req, res, next) {
    const media_id = parseInt(req.params.media_id);
    const media_is_tv = req.query.is_tv === 'true';
    const user_query_selection = { username:1, _id:1 };

    const comments = await Comment
        .find({ referred_media: media_id, is_tv: media_is_tv })
        .populate({
            path: 'owner',
            select: user_query_selection
        })
        .populate({
            path: 'replies'
        })
        .sort({_id: -1})
        .exec()

    for (const comment of comments) {
        await comment.populate({
            path: 'replies.owner',
            select: user_query_selection
        });
    }

    //console.log("username", c.toJSON());

    res.json(comments);
});

router.get('/comment/user/:username', async function (req, res, next) {
    const username = req.params.username;
    const user_query_selection = { username:1, _id:1 };

    let user_doc;
    try {
        user_doc = await get_user_doc(username);
    } catch (error) {
        return next(error);
    }

    const user_id = user_doc._id;

    const replies = await Reply.find({ owner: user_id }).select('_id').exec();
    const replies_ids = replies.map(reply => { return reply._id; });

    /** OR-query see https://stackoverflow.com/q/7382207 */
    const comments = await Comment
        .find({
            $or: [
                { owner: user_id },
                { "replies": { $elemMatch: { $in: replies_ids } } }
            ]
        })
        .populate({
            path: 'owner',
            select: user_query_selection
        })
        .populate({
            path: 'replies'
        })
        .sort({_id: -1})
        .exec()

    for (const comment of comments) {
        await comment.populate({
            path: 'replies.owner',
            select: user_query_selection
        });
    }

    res.json(comments);
});

router.post('/comment/medium/:media_id', validate_media_id, check_jwt, jwt_to_username, async function (req, res, next) {
    const username = res.locals.username;
    const user_id = res.locals.user_id;
    const media_id = parseInt(req.params.media_id);
    const media_is_tv = req.query.is_tv === 'true';
    const comment_is_review = req.query.is_review === 'true';

    if (!req.body.content) {
        res.status(400).send("Incorrect Request Body");
        return;
    }

    let comment = new Comment({
        owner: user_id,
        referred_media: media_id,
        is_tv: media_is_tv,
        is_review: comment_is_review
    });
    
    comment.set({ content: req.body.content });
    await comment.save();

    maintain_media_rating(user_id, media_id, media_is_tv);

    res.json({ object_id: comment._id });
});

router.get('/comment', validate_comment_id, async function (req, res, next) {
    const user_query_selection = { username:1, _id:1 };
    const comment_id = req.query.comment_id;

    const comment_handle = await Comment.findById(comment_id)
        .populate({
            path: 'owner',
            select: user_query_selection
        })
        .populate({
            path: 'replies'
        })
        .exec();

    if (!comment_handle) { return res.status(404).send(`Comment "${comment_id}" not found.`); }

    await comment_handle.populate({
        path: 'replies.owner',
        select: user_query_selection
    });

    res.send(comment_handle);
});

router.delete('/comment', validate_comment_id, check_jwt, jwt_to_username, async function (req, res, next) {
    const username = res.locals.username;
    const user_id = res.locals.user_id;
    const comment_id = req.query.comment_id;
    
    let comment_handle;
    try {
        comment_handle = await Comment.findById(comment_id).exec();
    } catch (error) { return next(error); }

    if (!comment_handle) {
        res.status(404).send(`Comment "${comment_id}" not found.`);
        return;
    }

    if (comment_handle.owner !== user_id) {
        res.status(401).send(`You are not the owner of specified object.`);
        return;
    }

    await Reply.deleteMany({ _id: { $in: comment_handle.replies } });

    await comment_handle.remove();

    res.send("Deleted");
});

router.get('/reply', validate_reply_id, async function (req, res, next) {
    const user_query_selection = { username:1, _id:1 };
    const reply_id = req.query.reply_id;

    const reply_handle = await Reply.findById(reply_id)
        .populate({
            path: 'owner',
            select: user_query_selection
        })
        .exec();

    if (!reply_handle) { return res.status(404).send(`Reply "${reply_id}" not found.`); }

    res.send(reply_handle);
});

router.post('/reply', validate_comment_id, check_jwt, jwt_to_username, async function (req, res, next) {
    const username = res.locals.username;
    const user_id = res.locals.user_id;
    const comment_id = req.query.comment_id;

    if (!req.body.content) {
        res.status(400).send("Incorrect Request Body");
        return;
    }

    let comment_handle = await Comment.findById(comment_id).exec();

    if (!comment_handle) {
        res.status(404).send(`Comment "${comment_id}" not found.`);
        return;
    }

    const media_id = comment_handle.referred_media
    const media_is_tv = comment_handle.is_tv

    let reply_handle = new Reply({
        owner: user_id,
        content: req.body.content,
        referred_media: media_id,
        is_tv: media_is_tv,
    });
    await reply_handle.save();

    comment_handle.replies.push(reply_handle._id);
    comment_handle.save(); /* we dont need to wait for it */

    maintain_media_rating(user_id, media_id, media_is_tv);

    res.json({ object_id: reply_handle._id });
});

router.delete('/reply', validate_reply_id, check_jwt, jwt_to_username, async function (req, res, next) {
    const username = res.locals.username;
    const user_id = res.locals.user_id;
    const reply_id = req.query.reply_id;

    let reply_handle = await Reply.findById(reply_id).exec();

    if (!reply_handle) {
        res.status(404).send(`Reply "${reply_id}" not found.`);
        return;
    }

    if (reply_handle.owner !== user_id) {
        res.status(401).send(`You are not the owner of specified object.`);
        return;
    }

    await Comment.updateMany({ /* all */ }, {
        $pull: { replies: reply_id }
    });

    await reply_handle.remove();

    res.json({ object_id: reply_handle._id });
});

// username_router.use("/me", check_jwt, jwt_to_username, router);
// username_router.use("/:username", to_username, router);

module.exports = router;
