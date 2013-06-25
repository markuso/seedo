'use strict';

/*!
 * User controllers
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../utils');

module.exports = {

  all: function(req, res) {
    User.find({}, function(err, users) {
      res.send(users);
    });
  },

  get: function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) { return res.send(500, err); }
      res.send(user);
    });
  },

  create: function(req, res, next) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function(err) {
      if (err) {
        return res.render('users/signup', {
          title: 'User Signup',
          errors: utils.errors(err.errors),
          user: user
        });
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });
  },

  update: function(req, res) {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, user) {
      if (err) { return res.send(500, err); }
      res.send(user);
    });
  },

  signin: function(req, res) {
    // Just to end the middleware stack
  },

  authCallback: function(req, res, next) {
    res.redirect('/');
  },

  login: function(req, res) {
    res.render('users/login', {
      title: 'User Login',
      message: req.flash('error')
    });
  },

  signup: function(req, res) {
    res.render('users/signup', {
      title: 'User Signup',
      user: new User()
    });
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/login');
  },

  session: function(req, res) {
    res.redirect('/');
  },

  show: function(req, res) {
    var user = req.profile;
    res.render('users/show', {
      title: user.name,
      user: user
    });
  },

  user: function(req, res, next, id) {
    User.findOne({ _id: id }).exec(function(err, user) {
      if (err) { return next(err); }
      if (!user) { return next(new Error('Failed to load User ' + id)); }
      req.profile = user;
      next();
    });
  }

};
