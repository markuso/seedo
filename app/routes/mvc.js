/*!
 * Auto MVC type routes
 *
 * GET, POST, PUT, DELETE methods are going to the same controller methods.
 */

module.exports = function(app) {

  // Route to the `index` method of a controller
  app.all('/:controller', function(req, res, next) {
    route(req.params.controller, 'index', req, res, next);
  });

  // Route to a method of a controller
  app.all('/:controller/:method', function(req, res, next) {
    route(req.params.controller, req.params.method, req, res, next);
  });

  // Route to a method of a controller passing in an `id`
  app.all('/:controller/:method/:id', function(req, res, next) {
    route(req.params.controller, req.params.method, req, res, next);
  });

};

// Execute the MVC route based on controller name, method and id
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
