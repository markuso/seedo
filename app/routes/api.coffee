# Auto RESTful API routes

module.exports = (app) ->

  # All route: GET method to REST API controllers
  app.get '/api/:controller', (req, res, next) ->
    route(req.params.controller, 'all', req, res, next)

  # Get route: GET method to REST API controllers
  app.get '/api/:controller/:id', (req, res, next) ->
    route(req.params.controller, 'get', req, res, next)

  # Create route: POST method to REST API controllers
  app.post '/api/:controller', (req, res, next) ->
    route(req.params.controller, 'create', req, res, next)

  # Update route: PUT method to REST API controllers
  app.put '/api/:controller/:id', (req, res, next) ->
    route(req.params.controller, 'update', req, res, next)

  # Delete route: DELETE method to REST API controllers
  app.del '/api/:controller/:id', (req, res, next) ->
    route(req.params.controller, 'delete', req, res, next)

  # For any other API calls
  app.all '/api/*', (req, res) ->
    console.warn "error 404: ", req.url
    res.send 404, { error: '404 URI not found' }

  return

# Execute the API route based on controller name, method and id
route = (controllerName, methodName, req, res, next) ->
  controllerName = 'index' if not controllerName?
  controller = null
  
  try
    controller = require "../controllers/#{controllerName}"
  catch e
    console.warn "controller not found: #{controllerName}", e
    next()
    return
  
  if typeof controller[methodName] is 'function'
    method = controller[methodName].bind controller
    # Call the method of the route
    method req, res, next
  else
    console.warn "method not found: #{methodName}"
    next()
