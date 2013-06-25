/*!
 * Main Express app file
 */

var fs = require('fs');
var express = require('express');
var assets = require('connect-assets');
var flash = require('connect-flash');
var mongoStore = require('connect-mongo')(express);
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config');

var app = express();
app.port = process.env.PORT || 3000;

var env = app.settings.env;

// Connect to our database
mongoose.connect(config.db.url);

// Bootstrap all models
// NOTE: Must be loaded before any modules that may
// `require` a mongoose model or else the server fails
var modelsPath = __dirname + '/models';
var modelFiles = fs.readdirSync(modelsPath);
for (var i = 0; i < modelFiles.length; i++) {
  file = modelFiles[i];
  if (~file.indexOf('.js')) {
    // Require the model file
    require(modelsPath + '/' + file);
  }
}

// Set some values from config to our `settings` locals object
app.set('app', config.app);
app.set('analyticsID', config.google.analyticsID);

// Use logger on development
if (env === 'development') {
  app.use(express.logger('dev'));
}

// Setup our common Express features
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.favicon());
app.use(express["static"](process.cwd() + '/public'));
app.use(assets());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({
  secret: 'u.rVY2PC_5gMuzec',
  store: new mongoStore({
    url: config.db.url,
    collection: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Adds CSRF support
if (env !== 'testing') {
  app.use(express.csrf());
  app.use(function(req, res, next) {
    res.locals.csrf_token = req.session._csrf;
    return next();
  });
}

// Add some locals to all templates
app.use(function(req, res, next) {
  res.locals.title = config.app.name || 'App';
  res.locals.req = req;
  res.locals.isActive = function(link) {
    if (req.url.indexOf(link)(!-1)) {
      return 'active';
    } else {
      return '';
    }
  };
  if (req.flash) {
    res.locals.info = req.flash('info');
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
  }
  next();
});

// Setup and include all of our routes
require('./routes')(app);
require('./routes/auth')(app, passport);
require('./routes/api')(app);
require('./routes/mvc')(app);

// Router should be last
app.use(app.router);

// Assume 404 since no middleware responded
app.use(function(req, res, next) {
  console.warn('Error 404: ', req.url);
  res.status(404);
  res.render('404', {
    url: req.originalUrl,
    error: 'Not found'
  });
});

module.exports = app;
