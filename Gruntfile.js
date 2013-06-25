'use strict';

/*!
 * Gruntfile with project configuration 
 */

module.exports = function(grunt) {
  
  /**
   * Configure grunt task options
   */

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    exec: {
      server: {
        command: [
          'node',
          './node_modules/supervisor/lib/cli-wrapper.js',
          '-w app,views',
          '-e js',
          'server'
        ].join(' ')
      },
      mocha: {
        command: 'NODE_ENV=testing mocha --colors --reporter spec --require should --require ./server test/server'
      },
      karma: {
        command: function(type) {
          if (!type) { type = 'unit'; }
          grunt.log.writeln('TEST TYPE = ' + type);
          // Run the Karma client tests with the `type` config file (unit, e2e, other)
          return 'NODE_ENV=testing karma start ./test/config/karma-' + type + '.conf.js';
        }
      }
    },

    copy: {
      libs: {
        files: [{
          src: [
            './components/angular/angular.min.js',
            './components/angular-resource/angular-resource.min.js',
            './components/angular-ui/build/angular-ui.min.js',
            './components/moment/min/moment.min.js',
            './components/json3/lib/json3.min.js',
            './components/es5-shim/es5-shim.min.js'
          ],
          dest: './assets/js/lib/',
          expand: true,
          flatten: true
        }]
      }
    }

  });

  /**
   * Load grunt task modules
   */

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');

  /**
   * Register tasks
   */

  grunt.registerTask('libs', 'Copy vendor libraries from bower lib folder', ['copy:libs']);

  grunt.registerTask('scaffold', 'Scaffold MongoDB model/controller/test', function(name) {
    if (!name) {
      grunt.log.writeln('Please specify a model name');
      return false;
    }
    grunt.log.writeln('Scaffolding ' + name);
    require('./scaffold')(name);
  });

  grunt.registerTask('server', 'Run the development server', ['exec:server']);
  grunt.registerTask('test', 'Run all server and client tests', ['exec:mocha','exec:karma:unit']);
  grunt.registerTask('karma', 'Run client tests with Karma', ['exec:karma:unit']);
  grunt.registerTask('mocha', 'Run server tests with Mocha', ['exec:mocha']);
  
  grunt.registerTask('default', ['server']);

};