# App config file

ENV       = process.env.NODE_ENV or 'development'

DEV_URL   = 'http://localhost:3000'
PROD_URL  = 'http://www.example.com'

APP_URL   = if ENV is 'production' then PROD_URL else DEV_URL

console.log "Set app environment: #{ENV}"

# Function used to choose a value from object
# depending on environment
choose = (obj) ->
  value = obj[ENV] or ''
  # Use the `development` value if `testing` is not set
  if not value and ENV is 'testing'
    value = obj['development'] or ''
  return value

# Application config object
config =
  app:
    name: 'App Name'
    description: ''
    url: choose
      development: DEV_URL
      production: PROD_URL
  
  db:
    url: choose
      development: 'mongodb://dev_user:NvPqz5Esh_8UsTF.@localhost:27017/example_dev'
      testing: 'mongodb://test_user:NvPqz5Esh_8UsTF.@localhost:27017/example_test'
      production: process.env.DB_URL
    options: {}
  
  google:
    clientID: choose
      development: '204587997451.apps.googleusercontent.com'
      production: 'CLIENT_ID'
    clientSecret: choose
      development: 'ej_bdJSFvmfuwc1hH4dv_jEn'
      production: 'SECRET_KEY'
    callbackURL: APP_URL+'/auth/google/callback'
    analyticsID: choose
      development: ''
      production: ''

  facebook:
    clientID: 'CLIENT_ID'
    clientSecret: 'SECRET_KEY'
    callbackURL: APP_URL+'/auth/facebook/callback'

  twitter:
    clientID: 'CLIENT_ID'
    clientSecret: 'SECRET_KEY'
    callbackURL: APP_URL+'/auth/twitter/callback'

  github:
    clientID: 'CLIENT_ID'
    clientSecret: 'SECRET_KEY'
    callbackURL: APP_URL+'/auth/github/callback'

module.exports = config
