const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
var crypto = require('crypto');
const b24api = require('./b24api');
var LocalStrategy = require('passport-local').Strategy;
// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo')(session);

/**
 * -------------- GENERAL SETUP ----------------
 */
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();
// Create the Express application
var app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * -------------- DATABASE ----------------
 */
/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */
//const conn = 'mongodb://devuser:123@localhost:27017/general_dev';
const conn = process.env.DB_STRING;
const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
});

const User = connection.model('User', UserSchema);
/**
 * This function is called when the `passport.authenticate()` method is called.
 *
 * If a user is found an validated, a callback is called (`cb(null, user)`) with the user
 * object.  The user object is then serialized with `passport.serializeUser()` and added to the
 * `req.session.passport` object.
 */
passport.use(
  new LocalStrategy(function (username, password, cb) {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false);
        }

        // Function defined at bottom of app.js
        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      })
      .catch((err) => {
        cb(err);
      });
  })
);

/**
 * This function is used in conjunction with the `passport.authenticate()` method.  See comments in
 * `passport.use()` above ^^ for explanation
 */
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});
/**
 * This function is used in conjunction with the `app.use(passport.session())` middleware defined below.
 * Scroll down and read the comments in the PASSPORT AUTHENTICATION section to learn how this works.
 *
 * In summary, this method is "set" on the passport object and is passed the user ID stored in the `req.session.passport`
 * object later on.
 */
passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

/**
 * -------------- SESSION SETUP ----------------
 */
/**
 * The MongoStore is used to store session data.  We will learn more about this in the post.
 *
 * Note that the `connection` used for the MongoStore is the same connection that we are using above
 */
const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});
/**
 * See the documentation for all possible options - https://www.npmjs.com/package/express-session
 *
 * As a brief overview (we will add more later):
 *
 * secret: This is a random string that will be used to "authenticate" the session.  In a production environment,
 * you would want to set this to a long, randomly generated string
 *
 * resave: when set to true, this will force the session to save even if nothing changed.  If you don't set this,
 * the app will still run but you will get a warning in the terminal
 *
 * saveUninitialized: Similar to resave, when set true, this forces the session to be saved even if it is unitialized
 *
 * store: Sets the MemoryStore to the MongoStore setup earlier in the code.  This makes it so every new session will be
 * saved in a MongoDB database in a "sessions" table and used to lookup sessions
 *
 * cookie: The cookie object has several options, but the most important is the `maxAge` property.  If this is not set,
 * the cookie will expire when you close the browser.  Note that different browsers behave slightly differently with this
 * behaviour (for example, closing Chrome doesn't always wipe out the cookie since Chrome can be configured to run in the
 * background and "remember" your last browsing session)
 */
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'strict',
    },
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
/**
 * Notice that these middlewares are initialized after the `express-session` middleware.  This is because
 * Passport relies on the `express-session` middleware and must have access to the `req.session` object.
 *
 * passport.initialize() - This creates middleware that runs before every HTTP request.  It works in two steps:
 *      1. Checks to see if the current session has a `req.session.passport` object on it.  This object will be
 *
 *          { user: '<Mongo DB user ID>' }
 *
 *      2.  If it finds a session with a `req.session.passport` property, it grabs the User ID and saves it to an
 *          internal Passport method for later.
 *
 * passport.session() - This calls the Passport Authenticator using the "Session Strategy".  Here are the basic
 * steps that this method takes:
 *      1.  Takes the MongoDB user ID obtained from the `passport.initialize()` method (run directly before) and passes
 *          it to the `passport.deserializeUser()` function (defined above in this module).  The `passport.deserializeUser()`
 *          function will look up the User by the given ID in the database and return it.
 *      2.  If the `passport.deserializeUser()` returns a user object, this user object is assigned to the `req.user` property
 *          and can be accessed within the route.  If no user is returned, nothing happens and `next()` is called.
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */
// app.get('/', (req, res, next) => {
//     res.send('<h1>Home</h1>');
// });
// When you visit http://localhost:3000/login, you will see "Login Page"
// app.get('/api/login', (req, res, next) => {

//     const form = '<h1>Login Page</h1><form method="POST" action="/login">\
//     Enter Username:<br><input type="text" name="username">\
//     <br>Enter Password:<br><input type="password" name="password">\
//     <br><br><input type="submit" value="Submit"></form>';
//     res.send(form);
// });
// Since we are using the passport.authenticate() method, we should be redirected no matter what
app.post('/api/login', passport.authenticate('local'), (req, res, next) => {
  res.json(req.user.username);
});
// When you visit http://localhost:3000/register, you will see "Register Page"
app.get('/api/register', (req, res, next) => {
  if (req.isAuthenticated()) {
    const form =
      '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';
    res.send(form);
  } else {
    res.send('<h1>You are not authenticated</h1>');
  }
});
app.post('/api/register', (req, res, next) => {
  if (req.isAuthenticated()) {
    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt,
    });
    newUser.save().then((user) => {
      console.log(user);
    });
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

// Visiting this route logs the user out
app.get('/api/logout', (req, res, next) => {
  console.log(req.user);
  req.logout();
  res.send('successful');
});
app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user.username);
  } else {
    res.json({ err: 'not authenticated' });
  }
});
app.post('/api/shipment/stage', (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.body);
    b24api.setStage(req.body);
  } else {
    res.status(401).json({ err: 'not authenticated' });
  }
});
app.post('/api/shipment', (req, res, next) => {
  if (req.isAuthenticated()) {
    b24api
      .getShipmentListWithBaskets(req.body.stages)
      .then((result) => res.send(result));
  } else {
    res.status(401).json({ err: 'not authenticated' });
  }
});
app.post('/api/items', (req, res, next) => {
  if (req.isAuthenticated()) {
    b24api
      .getItems({ stages: req.body.stages, orderIds: req.body.orderIds })
      .then((result) => res.send(result));
  } else {
    res.status(401).json({ err: 'not authenticated' });
  }
});

/**
 * -------------- SERVER ----------------
 */
// Server listens on http://localhost:4000

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('listening on ' + PORT));

/**
 * -------------- HELPER FUNCTIONS ----------------
 */
/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}
/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
}
