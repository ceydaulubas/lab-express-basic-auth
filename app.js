require('dotenv').config();

const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');
require('./configs/session.config')(app);


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
app.use('/', index);

//app.js know auth.routes
const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

// Routes
const router = require('./routes/auth.routes');
app.use('/', router);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        }),
        resave: true,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());


module.exports = app;
