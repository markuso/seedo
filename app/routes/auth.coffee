# Login and passport related routes

LocalStrategy    = require('passport-local').Strategy
GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy
FacebookStrategy = require('passport-facebook').Strategy
TwitterStrategy  = require('passport-twitter').Strategy
GitHubStrategy   = require('passport-github').Strategy

mongoose         = require 'mongoose'
User             = mongoose.model 'User'
config           = require '../config'
users            = require '../controllers/users'

module.exports = (app, passport) ->

  # Serialize passport user sessions
  passport.serializeUser (user, done) ->
    done(null, user.id)

  # Deserialize passport user sessions
  passport.deserializeUser (id, done) ->
    User.findOne { _id: id }, (err, user) ->
      done(err, user)

  # Setup the Local passport strategy
  passport.use new LocalStrategy(
    usernameField: 'email'
    passwordField: 'password'
  , (email, password, done) ->
    User.findOne { email: email }, (err, user) ->
      return done(err)  if err
      return done null, false, { message: 'Unknown user' }  unless user
      return done null, false, { message: 'Invalid password' }  unless user.authenticate(password)
      return done null, user
  )

  # Strategy options object builder function to be used with all provider
  strategyOptions = (provider) ->
    clientID: config[provider]?.clientID or 'CLIENT_ID'
    clientSecret: config[provider]?.clientSecret or 'SECRET_KEY'
    consumerKey: config[provider]?.clientID or 'CLIENT_ID'
    consumerSecret: config[provider]?.clientSecret or 'SECRET_KEY'
    callbackURL: config[provider]?.callbackURL or config.app.url+'/auth/'+provider+'/callback'
    passReqToCallback: true

  # Strategy callback function builder to be used with all providers
  strategyCallback = (provider) ->
    return (req, accessToken, refreshToken, profile, done) ->
      unless req.user
        # Login or create a new user from provider
        User.findOne({}).where(provider+'.id').equals(profile.id).exec (err, user) ->
          return done(err)  if err
          unless user
            user = new User(
              name: profile.displayName
              email: profile.emails?[0].value or ''
              username: profile.username
              provider: provider
            )
            user[provider] = profile._json
            user.save (err) -> done err, user
          else
            done err, user
      else
        # Associate with currently logged in user account if it is not already
        user = req.user
        unless user[provider]?.id is profile.id
          user[provider] = profile._json
          user.save (err) -> done err, user
        else
          done null, user

  # Setup Google passport strategy
  passport.use new GoogleStrategy(strategyOptions('google'), strategyCallback('google'))

  # Setup Facebook passport strategy
  passport.use new FacebookStrategy(strategyOptions('facebook'), strategyCallback('facebook'))

  # Setup Twitter passport strategy
  passport.use new TwitterStrategy(strategyOptions('twitter'), strategyCallback('twitter'))

  # Setup GitHub passport strategy
  passport.use new GitHubStrategy(strategyOptions('github'), strategyCallback('github'))

  # Setup auth middlewares to be used for the auth routes below

  localAuth = passport.authenticate 'local',
    failureRedirect: '/login'
    failureFlash: 'Invalid email or password.'

  googleAuth = passport.authenticate 'google',
    failureRedirect: '/login'
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile'
      'https://www.googleapis.com/auth/userinfo.email'
    ]

  googleAuthBack = passport.authenticate 'google',
    failureRedirect: '/login'

  facebookAuth = passport.authenticate 'facebook',
    scope: ['email', 'user_about_me']
    failureRedirect: '/login'

  facebookAuthBack = passport.authenticate 'facebook',
    failureRedirect: '/login'

  twitterAuth = passport.authenticate 'twitter',
    failureRedirect: '/login'

  githubAuth = passport.authenticate 'github',
    failureRedirect: '/login'

  app.get '/login', users.login
  app.get '/signup', users.signup
  app.get '/logout', users.logout
  app.post '/users', users.create
  app.post '/users/session', localAuth, users.session
  app.get '/users/:userId', users.show
  app.get '/auth/facebook', facebookAuth, users.signin
  app.get '/auth/facebook/callback', facebookAuthBack, users.authCallback
  app.get '/auth/github', githubAuth, users.signin
  app.get '/auth/github/callback', githubAuth, users.authCallback
  app.get '/auth/twitter', twitterAuth, users.signin
  app.get '/auth/twitter/callback', twitterAuth, users.authCallback
  app.get '/auth/google', googleAuth, users.signin
  app.get '/auth/google/callback', googleAuthBack, users.authCallback

  app.param 'userId', users.user

  return
  