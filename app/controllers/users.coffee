# User controllers

mongoose   = require 'mongoose'
User       = mongoose.model 'User'
utils      = require '../utils'

module.exports = 

  # Lists all users
  all: (req, res) ->
    User.find {}, (err, users) ->
      res.send users
        
  # Gets user by id
  get: (req, res) ->
    User.findById req.params.id, (err, user) ->
      if not err
        res.send user
      else
        res.send 500, err
      
  # Creates new user with data from `req.body`
  # then login the user at the same time
  create: (req, res, next) ->
    user = new User(req.body)
    user.provider = 'local'
    user.save (err) ->
      if err
        return res.render 'users/signup',
          title: 'User Signup'
          errors: utils.errors(err.errors)
          user: user
      
      # Manually login the user once successfully signed up
      req.logIn user, (err) ->
        return next(err) if err
        res.redirect '/'
             
  # Updates user with data from `req.body`
  update: (req, res) ->
    User.findByIdAndUpdate req.params.id, { $set: req.body }, (err, user) ->
      if not err
        res.send user
      else
        res.send 500, err
    
  # Deletes user by id
  # delete: (req, res) ->
  #   User.findByIdAndRemove req.params.id, (err) ->
  #     if not err
  #       res.send {}
  #     else
  #       res.send 500, err


  signin: (req, res) ->

  # Auth callback redirect
  authCallback: (req, res, next) ->
    res.redirect '/'

  # Show login form
  login: (req, res) ->
    res.render 'users/login',
      title: 'User Login',
      message: req.flash('error')

  # Show sign up form
  signup: (req, res) ->
    res.render 'users/signup',
      title: 'User Signup'
      user: new User()

  # Logout
  logout: (req, res) ->
    req.logout()
    res.redirect '/login'

  # Session
  session: (req, res) ->
    res.redirect '/'

  # Show profile
  show: (req, res) ->
    user = req.profile
    res.render 'users/show',
      title: user.name
      user: user

  # Find user by id
  user: (req, res, next, id) ->
    User.findOne(_id: id).exec (err, user) ->
      return next(err)  if err
      return next(new Error('Failed to load User ' + id))  unless user
      req.profile = user
      next()
