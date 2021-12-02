var express = require('express');
const { checkJwt } = require("../auth/check-jwt");
var router = express.Router();

/* GET users listing. */
router.get('/:user_id', checkJwt, function(req, res, next) {
  res.send(`Hello ${req.params.user_id}! Your JWT is legit!`);
});

module.exports = router;
