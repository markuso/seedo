'use strict';

/*!
 * Main config file exporting a `config` object
 */

var ENV = process.env.NODE_ENV || 'development';
var DEV_URL = 'http://localhost:3000';
var PROD_URL = 'http://www.example.com';
var APP_URL = ENV === 'production' ? PROD_URL : DEV_URL;

console.log('Set app environment: ' + ENV);

/**
 * Function that takes an object with development, testing, and production
 * values then return the one that matches the current environment.
 *
 * @param {Object} options - Object with values to choose between
 * @return {Object} Value chosen according to environment
 * @api private
 */

function choose(options) {
  if (!options) { options = {}; }
  var value = options[ENV] || '';
  if (!value && ENV === 'testing') {
    value = options.development || '';
  }
  return value;
}

/**
 * Config object to be exported
 */

var config = {
  
  app: {
    name: 'App Name',
    description: '',
    url: choose({
      development: DEV_URL,
      production: PROD_URL
    })
  },

  db: {
    url: choose({
      development: 'mongodb://dev_user:NvPqz5Esh_8UsTF.@localhost:27017/example_dev',
      testing: 'mongodb://test_user:NvPqz5Esh_8UsTF.@localhost:27017/example_test',
      production: process.env.DB_URL
    }),
    options: {}
  },

  google: {
    clientID: choose({
      development: '204587997451.apps.googleusercontent.com',
      production: 'CLIENT_ID'
    }),
    clientSecret: choose({
      development: 'ej_bdJSFvmfuwc1hH4dv_jEn',
      production: 'SECRET_KEY'
    }),
    callbackURL: APP_URL + '/auth/google/callback',
    analyticsID: choose({
      development: '',
      production: ''
    })
  },

  facebook: {
    clientID: 'CLIENT_ID',
    clientSecret: 'SECRET_KEY',
    callbackURL: APP_URL + '/auth/facebook/callback'
  },

  twitter: {
    clientID: 'CLIENT_ID',
    clientSecret: 'SECRET_KEY',
    callbackURL: APP_URL + '/auth/twitter/callback'
  },

  github: {
    clientID: 'CLIENT_ID',
    clientSecret: 'SECRET_KEY',
    callbackURL: APP_URL + '/auth/github/callback'
  }

};

module.exports = config;
