/*!
 * Auto RESTful API routes
 */

module.exports = function(app) {

  // All route: GET method to REST API controllers
  app.get('/api/:controller', function(req, res, next) {
    route(req.params.controller, 'all', req, res, next);
  });

  // Get route: GET method to REST API controllers
  app.get('/api/:controller/:id', function(req, res, next) {
    route(req.params.controller, 'get', req, res, next);
  });

  // Create route: POST method to REST API controllers
  app.post('/api/:controller', function(req, res, next) {
    route(req.params.controller, 'create', req, res, next);
  });

  // Update route: PUT method to REST API controllers
  app.put('/api/:controller/:id', function(req, res, next) {
    route(req.params.controller, 'update', req, res, next);
  });

  // Delete route: DELETE method to REST API controllers
  app.del('/api/:controller/:id', function(req, res, next) {
    route(req.params.controller, 'delete', req, res, next);
  });

  // For any other API calls
  app.all('/api/*', function(req, res) {
    console.warn("error 404: ", req.url);
    res.send(404, {
      error: '404 URI not found'
    });
  });
  
};

// Execute the API route based on controller name, method and id
function route(controllerName, methodName, req, res, next) {
  var controller = null;
  if (controllerName == null) controllerName = 'index';
  try {
    controller = require('../controllers/' + controllerName);
  } catch (e) {
    console.warn('controller not found: ' + controllerName, e);
    return next();
  }
  if (typeof controller[methodName] === 'function') {
    var method = controller[methodName].bind(controller);
    return method(req, res, next);
  } else {
    console.warn('method not found: ' + methodName);
    return next();
  }
};
