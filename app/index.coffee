fs           = require 'fs'
express      = require 'express'
assets       = require 'connect-assets'
flash        = require 'connect-flash'
mongoStore   = require('connect-mongo')(express)
mongoose     = require 'mongoose'
passport     = require 'passport'
config       = require './config'

app          = express()
app.port     = process.env.PORT or 3000
env          = app.settings.env

# Connect to our database
mongoose.connect config.db.url

# Bootstrap all models
# NOTE: Must be loaded before any modules that may
# `require` a mongoose model or else the server fails
modelsPath = __dirname + '/models'
modelFiles = fs.readdirSync(modelsPath)
for file in modelFiles
  if ~file.indexOf('.js')
    require(modelsPath + '/' + file)

# Set some values from config to our `settings` locals object
app.set 'app', config.app
app.set 'analyticsID', config.google.analyticsID

# Use logger on development
if env is 'development'
  app.use express.logger('dev')

# Setup our common Express features
app.set 'view engine', 'jade'
app.use express.compress()
app.use express.favicon()
app.use express.static(process.cwd() + '/public')
app.use assets()
app.use express.cookieParser()
app.use express.bodyParser()
app.use express.methodOverride()
app.use express.session(
  secret: 'u.rVY2PC_5gMuzec'
  store: new mongoStore
    url: config.db.url
    collection: 'sessions'
)
app.use passport.initialize()
app.use passport.session()
app.use flash()

# Adds CSRF support
if env isnt 'testing'
  app.use express.csrf()
  app.use (req, res, next) ->
    res.locals.csrf_token = req.session._csrf
    next()

# Add some locals to all templates
app.use (req, res, next) ->
  res.locals.title = config.app.name or 'App'
  res.locals.req = req
  res.locals.isActive = (link) ->
    return if req.url.indexOf(link) not -1 then 'active' else ''
  if req.flash
    res.locals.info = req.flash('info')
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.warning = req.flash('warning')
  next()

# Setup and include all of our routes
require('./routes')(app)
require('./routes/auth')(app, passport)
require('./routes/api')(app)
require('./routes/mvc')(app)

# Router should be last
app.use app.router

# Assume 404 since no middleware responded
app.use (req, res, next) ->
  console.warn 'Error 404: ', req.url
  res.status 404
  res.render '404',
    url: req.originalUrl
    error: 'Not found'

module.exports = app
