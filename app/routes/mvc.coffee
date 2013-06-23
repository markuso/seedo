# Auto MVC type routes
#
# GET, POST, PUT, DELETE methods are going to the same controller methods.

module.exports = (app) ->
  
  # Route to the `index` method of a controller
  app.all '/:controller', (req, res, next) ->
    route(req.params.controller, 'index', req, res, next)

  # Route to a method of a controller
  app.all '/:controller/:method', (req, res, next) ->
    route(req.params.controller, req.params.method, req, res, next)

  # Route to a method of a controller passing in an `id`
  app.all '/:controller/:method/:id', (req, res, next) ->
    route(req.params.controller, req.params.method, req, res, next)

  return

# Execute the MVC route based on controller name, method and id
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
    console.warn 'method not found: ' + methodName
    next()
