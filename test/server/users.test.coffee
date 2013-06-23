# User Tests

request    = require 'supertest'
mongoose   = require 'mongoose'
User       = mongoose.model 'User'
app        = require process.cwd() + '/_app'


INITIAL_DATA = {
  "someField": "Some Data"
}

UPDATED_DATA = {
  "someField": "Another data"
}

cleanDB = (done) ->
  User.remove {}, ->
    done()

describe 'User Tests', ->
  before cleanDB
  
  userId = null
      
  it 'should be created', (done) ->
    request(app)
      .post('/api/users')
      .send(INITIAL_DATA)
      .expect 201, (err, res) ->
        res.body.should.include(INITIAL_DATA)
        res.body.should.have.property '_id'
        res.body['_id'].should.be.ok
        userId = res.body['_id']
        done()
        
  it 'should be accessible by id', (done) ->
    request(app)
      .get("/api/users/#{userId}")
      .expect 200, (err, res) ->
        res.body.should.include(INITIAL_DATA)
        res.body.should.have.property '_id'
        res.body['_id'].should.be.eql userId
        done()
        
  it 'should be listed in list', (done) ->
    request(app)
      .get('/api/users')
      .expect 200, (err, res) ->
        res.body.should.be.an.instanceof Array
        res.body.should.have.length 1
        res.body[0].should.include(INITIAL_DATA)
        done()
    
  it 'should be updated', (done) ->
    request(app)
      .put("/api/users/#{userId}")
      .send(UPDATED_DATA)
      .expect 200, (err, res) ->
        res.body.should.include(UPDATED_DATA)
        done()
        
  it 'should be persisted after update', (done) ->
    request(app)
      .get("/api/users/#{userId}")
      .expect 200, (err, res) ->
        res.body.should.include(UPDATED_DATA)
        res.body.should.have.property '_id'
        res.body['_id'].should.be.eql userId
        done()
  
  it 'should be removed', (done) ->
    request(app)
      .del("/api/users/#{userId}")
      .expect 200, (err, res) ->
        done()
    
  it 'should not be listed after remove', (done) ->
    request(app)
      .get('/api/users')
      .expect 200, (err, res) ->
        res.body.should.be.an.instanceof Array
        res.body.should.have.length 0
        done()
        
  after cleanDB
