/*!
 * Default and misc routes
 */

var controllers = require('../controllers');
var auth = require('../middlewares/authorization');

module.exports = function(app) {
  app.get('/', controllers.index);
  app.get('/app', auth.requiresLogin, controllers.client);
  app.get('/partials/:name', controllers.partial);
};
