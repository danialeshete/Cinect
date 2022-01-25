const express = require('express');
const check_jwt = require("../auth/check-jwt");

const router = express.Router({ mergeParams: true });

const UserProfile = require('../models/user_profile');


router.get('/users', async function (req, res, next) {
    const query = String(req.query.q);

    /** find by substring: https://stackoverflow.com/a/56808870
     * Problem: case-sensitive
     */
    // const users = await UserProfile.aggregate([{
    //     $match: { $expr: { $gt: [{ $indexOfCP: ["$username", query] }, -1] } }
    // }, { $project: { username: 1, _id: 0 } }]);

    const users = await UserProfile
        .find({ username: {$regex: query, $options: "$i" }})
        .select({ _id: 0, username: 1, user_description: 1 })
        .exec();

    res.json(users);
});


module.exports = router;
