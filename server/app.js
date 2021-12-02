var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

app.use(logger('dev'));
app.use(cors()); /* Enable Cross-origin requests (CORS) */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);

module.exports = app;
