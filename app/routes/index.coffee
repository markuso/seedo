# Default and misc routes

controllers  = require '../controllers'
auth         = require('../middlewares/authorization')

module.exports = (app) ->

  app.get '/', controllers.index

  app.get '/app', auth.requiresLogin, controllers.client

  app.get '/partials/:name', controllers.partial

  return
