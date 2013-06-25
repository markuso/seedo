'use strict';

/*!
 * User schema and model
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var authTypes = ['google', 'facebook', 'twitter', 'github'];


/**
 * User Schema
 */

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  provider: String,
  passwordHash: String,
  salt: String,
  authToken: String,
  google: {},
  facebook: {},
  twitter: {},
  github: {},
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});


/**
 * Virtuals
 */

UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.passwordHash = this.encryptPassword(password);
}).get(function() {
  return this._password;
});

UserSchema.virtual('avatar').get(function() {
  return (this.google != null ? this.google.picture : null) || '/img/avatar.png';
});


/**
 * Validations
 */

var validatePresenceOf = function(value) {
  return value && value.length;
};

UserSchema.path('name').validate((function(name) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return name.length;
}), 'Name cannot be blank');

UserSchema.path('email').validate((function(email) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return email.length;
}), 'Email cannot be blank');

UserSchema.path('email').validate((function(email, fn) {
  var User = mongoose.model('User');
  if (this.isNew || this.isModified('email')) {
    return User.find({
      email: email
    }).exec(function(err, users) {
      return fn(err || users.length === 0);
    });
  } else {
    return fn(true);
  }
}), 'Email already exists');

UserSchema.path('username').validate((function(username) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return username.length;
}), 'Username cannot be blank');

UserSchema.path('passwordHash').validate((function(passwordHash) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return passwordHash.length;
}), 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  this.updated = new Date();
  if (!this.isNew) {
    return next();
  }
  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
    return next(new Error('Invalid password'));
  }
  next();
});


/**
 * Methods
 */

UserSchema.methods = {

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.passwordHash;
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      var encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred;
    } catch (err) {
      return '';
    }
  }

};

/**
 * Create the mongoose model
 */

mongoose.model('User', UserSchema);
