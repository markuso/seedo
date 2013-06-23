# Top level tests

request = require 'supertest'
app     = require process.cwd() + '/_app'


describe 'General Tests', ->

  it 'should render main page', (done) ->
    request(app)
      .get('/')
      .expect 200, (err, res) ->
        done()

  it 'should return 404 for invalid API call', (done) ->
    request(app)
      .get('/api/nonexistent')
      .expect 404, (err, res) ->
        done()
