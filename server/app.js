const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const discussionRouter = require('./routes/discussions');
const findRouter = require('./routes/find');

const mongo_uri = process.env.MONGO_URI || "mongodb://root:ws21@localhost/admin";

mongoose.connect(mongo_uri, {
    dbName: "cinect",
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

app.use(logger('dev'));
app.use(cors()); /* Enable Cross-origin requests (CORS) */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/discussions', discussionRouter);
app.use('/find', findRouter);

module.exports = app;
