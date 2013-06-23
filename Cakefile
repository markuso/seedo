fs            = require 'fs'
wrench        = require 'wrench'
{print}       = require 'util'
which         = require 'which'
{spawn, exec} = require 'child_process'

# ANSI Terminal Colors
bold  = '\x1B[0;1m'
red   = '\x1B[0;31m'
green = '\x1B[0;32m'
reset = '\x1B[0m'

pkg = JSON.parse fs.readFileSync('./package.json')
testCmd = pkg.scripts.test
startCmd = pkg.scripts.start
  

log = (message, color, explanation) ->
  console.log color + message + reset + ' ' + (explanation or '')

setEnvironment = (env = 'development') ->
  process.env.NODE_ENV = env
  log 'Setting NODE_ENV to', green, env

# Compiles the `app` directory to the _app directory
build = (callback) ->
  setEnvironment()
  options = ['-c','-b', '-o', '_app', 'app']
  cmd = which.sync 'coffee'
  coffee = spawn cmd, options
  coffee.stdout.pipe process.stdout
  coffee.stderr.pipe process.stderr
  coffee.on 'exit', (status) -> callback?() if status is 0

# Mocha server test
test = (callback) ->
  setEnvironment 'testing'
  options = [
    '--globals'
    'hasCert,res'
    '--reporter'
    'spec'
    '--compilers'
    'coffee:coffee-script'
    '--colors'
    '--require'
    'should'
    '--require'
    './server'
    'test/server'
  ]
  try
    cmd = which.sync 'mocha' 
    spec = spawn cmd, options
    spec.stdout.pipe process.stdout 
    spec.stderr.pipe process.stderr
    spec.on 'exit', (status) -> callback?() if status is 0
  catch err
    log err.message, red
    log 'Mocha is not installed - try npm install mocha -g', red

task 'docs', 'Generate annotated source code with Docco', ->
  setEnvironment()
  files = wrench.readdirSyncRecursive("app")
  files = ("app/#{file}" for file in files when /\.coffee$/.test file)
  log files
  try
    cmd = './node_modules/.bin/docco-husky'
    docco = spawn cmd, files
    docco.stdout.pipe process.stdout
    docco.stderr.pipe process.stderr
    docco.on 'exit', (status) -> callback?() if status is 0
  catch err
    log err.message, red
    log 'Docco is not installed - try npm install docco -g', red


task 'build', 'Build app (coffee) code to _app (js)', ->
  build -> log ":)", green

task 'test', 'Run Mocha tests', ->
  build -> test -> log ":)", green

option '-c', '--config [CONFIG]', 'config type like `unit`, `e2e`, or `other`'
task 'spec', 'Run Karma tests', (options) ->
  setEnvironment 'testing'
  options.config ?= 'unit'
  extras = [
    'start'
    "test/config/karma-#{options.config}.conf.js"
  ]
  log 'Run Karma tests using:', green, "karma-#{options.config}.conf.js"
  try
    cmd = which.sync 'karma' 
    spec = spawn cmd, extras
    spec.stdout.pipe process.stdout 
    spec.stderr.pipe process.stderr
    spec.on 'exit', (status) -> callback?() if status is 0
  catch err
    log err.message, red
    log 'Karma is not installed - try npm install karma -g', red

task 'dev', 'Start DEV environment', ->
  setEnvironment 'development'
  # watch_coffee
  options = ['-c', '-b', '-w', '-o', '_app', 'app']
  cmd = which.sync 'coffee'
  coffee = spawn cmd, options
  coffee.stdout.pipe process.stdout
  coffee.stderr.pipe process.stderr
  log 'Watching coffee files', green
  # watch_js
  supervisor = spawn 'node', [
    './node_modules/supervisor/lib/cli-wrapper.js',
    '-w',
    '_app,views', 
    '-e', 
    'js|jade', 
    'server'
  ]
  supervisor.stdout.pipe process.stdout
  supervisor.stderr.pipe process.stderr
  log 'Watching js files and running server', green
  
task 'debug', 'Start DEBUG environment', ->
  setEnvironment 'development'
  # watch_coffee
  options = ['-c', '-b', '-w', '-o', '_app', 'app']
  cmd = which.sync 'coffee'  
  coffee = spawn cmd, options
  coffee.stdout.pipe process.stdout
  coffee.stderr.pipe process.stderr
  log 'Watching coffee files', green
  # run debug mode
  app = spawn 'node', [
    '--debug',
    'server'
  ]
  app.stdout.pipe process.stdout
  app.stderr.pipe process.stderr
  # run node-inspector
  inspector = spawn 'node-inspector'
  inspector.stdout.pipe process.stdout
  inspector.stderr.pipe process.stderr
  # run google chrome
  chrome = spawn 'google-chrome', ['http://0.0.0.0:8080/debug?port=5858']
  chrome.stdout.pipe process.stdout
  chrome.stderr.pipe process.stderr
  log 'Debugging server', green
  
option '-n', '--name [NAME]', 'name of model to `scaffold`'
task 'scaffold', 'Scaffold a mongoDB model/controller/test', (options) ->
  setEnvironment()
  if not options.name?
    log "Please specify a model name", red
    process.exit(1)
  log "Scaffolding `#{options.name}`", green
  scaffold = require './scaffold'
  scaffold options.name

task 'copy-libs', 'Copy bower components to lib asset folder', ->
  sources = [
    'components/angular/angular.min.js'
    'components/angular-resource/angular-resource.min.js'
    'components/angular-ui/build/angular-ui.min.js'
    'components/moment/min/moment.min.js'
    'components/json3/lib/json3.min.js'
    'components/es5-shim/es5-shim.min.js'
  ]
  target = 'assets/js/lib/'
  options = ['-f','-v']
  options.push(sources...)
  options.push(target)
  cmd = which.sync 'cp'
  copy = spawn cmd, options
  copy.stdout.pipe process.stdout
  copy.stderr.pipe process.stderr
  copy.on 'exit', (status) -> callback?() if status is 0
