/**
 * Express server run script
 */

var app = require('./app');
var port = app.port;

app.listen(port, function() {
  return console.log("Listening on " + port + "\nPress CTRL-C to stop server.");
});
