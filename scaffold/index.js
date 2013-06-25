'use strict';

/*!
 * Express + mongoose + mocha scaffolding function
 */

var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

module.exports = function(name) {
  var name = name.toLowerCase();
  var renderParams = { name: name };
  var appDir = path.normalize((__dirname + '/../'));

  var renderAndSave = function(templateName, outputName) {
    if (fs.existsSync(outputName)) {
      console.log('! ' + outputName + ' already exists!');
      process.exit(1);
    }

    var template = fs.readFileSync(__dirname + '/' + templateName, 'utf-8');
    var renderedTemplate = ejs.render(template, renderParams);
    
    fs.writeFileSync(appDir+outputName, renderedTemplate);
    console.log('# ' + outputName + ' created');
  }

  renderAndSave('controller.js.ejs', 'app/controllers/' + name + 's.js');
  renderAndSave('model.js.ejs', 'app/models/' + name + '.js');
  renderAndSave('test.js.ejs', 'test/server/' + name + 's.test.js');

  console.log('Finished scaffolding `' + name + '` :)');
};
