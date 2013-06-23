# User model

mongoose  = require 'mongoose'
crypto    = require 'crypto'
authTypes = ['google', 'facebook', 'twitter', 'github']

###
User Schema
###

UserSchema = new mongoose.Schema(
  name: String
  email: String
  username: String
  provider: String
  passwordHash: String
  salt: String
  authToken: String
  google: {}
  facebook: {}
  twitter: {}
  github: {}
  created: { type: Date, default: Date.now }
  updated: { type: Date, default: Date.now }
)

###
Virtuals
###

UserSchema.virtual('password')
  .set (password) ->
    @_password = password
    @salt = @makeSalt()
    @passwordHash = @encryptPassword(password)
    @
  .get ->
    @_password

UserSchema.virtual('avatar').get ->
  @google?.picture or '/img/avatar.png'

###
Validations
###

validatePresenceOf = (value) ->
  value and value.length

# the below 4 validations only apply if you are signing up traditionally

UserSchema.path('name').validate ((name) ->
  # if you are authenticating by any of the oauth strategies, don't validate
  return true if authTypes.indexOf(@provider) isnt -1
  name.length
), 'Name cannot be blank'

UserSchema.path('email').validate ((email) ->  
  # if you are authenticating by any of the oauth strategies, don't validate
  return true if authTypes.indexOf(@provider) isnt -1
  email.length
), 'Email cannot be blank'

UserSchema.path('email').validate ((email, fn) ->
  User = mongoose.model('User')
  
  # Check only when it is a new user or when email field is modified
  if @isNew or @isModified('email')
    User.find(email: email).exec (err, users) ->
      fn err or users.length is 0
  else
    fn true
), 'Email already exists'

UserSchema.path('username').validate ((username) ->
  # if you are authenticating by any of the oauth strategies, don't validate
  return true  if authTypes.indexOf(@provider) isnt -1
  username.length
), 'Username cannot be blank'

UserSchema.path('passwordHash').validate ((passwordHash) ->
  # if you are authenticating by any of the oauth strategies, don't validate
  return true  if authTypes.indexOf(@provider) isnt -1
  passwordHash.length
), 'Password cannot be blank'


###
Pre-save hook
###

UserSchema.pre 'save', (next) ->
  @updated = new Date()
  return next() unless @isNew
  if not validatePresenceOf(@password) and authTypes.indexOf(@provider) is -1
    next new Error('Invalid password')
  else
    next()


###
Methods
###

UserSchema.methods =
  
  authenticate: (plainText) ->
    @encryptPassword(plainText) is @passwordHash

  makeSalt: ->
    Math.round((new Date().valueOf() * Math.random())) + ''

  encryptPassword: (password) ->
    return '' unless password
    encrypred = undefined
    try
      encrypred = crypto.createHmac('sha1', @salt).update(password).digest('hex')
      return encrypred
    catch err
      return ''

mongoose.model 'User', UserSchema
