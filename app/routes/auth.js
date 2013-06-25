/*!
 * Login and passport related routes
 */

var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;

var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('../config');
var users = require('../controllers/users');

module.exports = function(app, passport) {

  // Serialize passport user sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize passport user sessions
  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function(err, user) {
      done(err, user);
    });
  });

  // Setup the Local passport strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Unknown user' });
      if (!user.authenticate(password)) return done(null, false, { message: 'Invalid password' });
      done(null, user);
    });
  }));

  // Strategy options object builder function to be used with all provider
  function strategyOptions(provider) {
    var setting = config[provider];
    if (setting != null) setting = {};
    var clientID = setting.clientID || 'CLIENT_ID';
    var clientSecret = setting.clientSecret || 'SECRET_KEY';
    var callbackURL = setting.callbackURL || config.app.url + '/auth/' + provider + '/callback';
    return {
      clientID: clientID,
      clientSecret: clientSecret,
      consumerKey: clientID,
      consumerSecret: clientSecret,
      callbackURL: callbackURL,
      passReqToCallback: true
    };
  };

  // Strategy callback function builder to be used with all providers
  function strategyCallback(provider) {
    return function(req, accessToken, refreshToken, profile, done) {
      if (!req.user) {
        // Login or create a new user from provider
        User.findOne({}).where(provider + '.id').equals(profile.id).exec(function(err, user) {
          if (err) return done(err)
          if (!user) {
            user = new User({
              name: profile.displayName,
              email: (profile.emails != null ? profile.emails[0].value : null) || '',
              username: profile.username,
              provider: provider
            });
            user[provider] = profile._json;
            user.save(function(err) {
              done(err, user);
            });
          } else {
            done(err, user);
          }
        });
      } else {
        // Associate with currently logged in user account if it is not already
        var user = req.user;
        if ((user[provider] != null ? user[provider].id : null) !== profile.id) {
          user[provider] = profile._json;
          user.save(function(err) {
            done(err, user);
          });
        } else {
          done(null, user);
        }
      }
    };
  };

  // Setup Google passport strategy
  passport.use(new GoogleStrategy(strategyOptions('google'), strategyCallback('google')));
  
  // Setup Facebook passport strategy
  passport.use(new FacebookStrategy(strategyOptions('facebook'), strategyCallback('facebook')));
  
  // Setup Twitter passport strategy
  passport.use(new TwitterStrategy(strategyOptions('twitter'), strategyCallback('twitter')));
  
  // Setup GitHub passport strategy
  passport.use(new GitHubStrategy(strategyOptions('github'), strategyCallback('github')));
  
  
  /**
   * Setup auth middlewares to be used for the auth routes below
   */

  var localAuth = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid email or password.'
  });

  var googleAuth = passport.authenticate('google', {
    failureRedirect: '/login',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  });

  var googleAuthBack = passport.authenticate('google', {
    failureRedirect: '/login'
  });

  var facebookAuth = passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/login'
  });

  var facebookAuthBack = passport.authenticate('facebook', {
    failureRedirect: '/login'
  });

  var twitterAuth = passport.authenticate('twitter', {
    failureRedirect: '/login'
  });

  var githubAuth = passport.authenticate('github', {
    failureRedirect: '/login'
  });

  /**
   * Configure user login routes
   */

  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session', localAuth, users.session);
  app.get('/users/:userId', users.show);
  app.get('/auth/facebook', facebookAuth, users.signin);
  app.get('/auth/facebook/callback', facebookAuthBack, users.authCallback);
  app.get('/auth/github', githubAuth, users.signin);
  app.get('/auth/github/callback', githubAuth, users.authCallback);
  app.get('/auth/twitter', twitterAuth, users.signin);
  app.get('/auth/twitter/callback', twitterAuth, users.authCallback);
  app.get('/auth/google', googleAuth, users.signin);
  app.get('/auth/google/callback', googleAuthBack, users.authCallback);
  
  app.param('userId', users.user);

};
