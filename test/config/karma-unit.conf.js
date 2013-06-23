// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '../../';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  './assets/js/lib/angular.min.js',
  './assets/js/lib/angular-mocks.js',
  './assets/js/lib/moment.min.js',
  './assets/js/app.coffee',
  './assets/js/controllers/*.coffee',
  './assets/js/directives/*.coffee',
  './assets/js/services/*.coffee',
  './test/mock/**/*.coffee',
  './test/client/**/*.coffee'
];

preprocessors = {
  '**/*.coffee': 'coffee'
};

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;

urlRoot = '/app';

// Need to proxy over to our running app server and location
proxies = {
  '/': 'http://localhost:3000'
};
