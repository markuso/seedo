# Post Tests

request    = require 'supertest'
mongoose   = require 'mongoose'
Post       = mongoose.model 'Post'
app        = require process.cwd() + '/_app'


POST_DATA = {
  "title": "Some Title",
  "body": "body of post",
  "slug": "some-url"
}

UPDATED_POST_DATA = {
  "title": "Another title",
  "body": "another body of post",
  "slug": "some-another-url"
}

cleanDB = (done) ->
  Post.remove {}, ->
    done()

describe 'Post Tests', ->
  before cleanDB
  
  postId = null
      
  it 'should be created', (done) ->
    request(app)
      .post('/api/posts')
      .send(POST_DATA)
      .expect 201, (err, res) ->
        res.body.should.include(POST_DATA)
        res.body.should.have.property '_id'
        res.body['_id'].should.be.ok
        postId = res.body['_id']
        done()
        
  it 'should be accessible by id', (done) ->
    request(app)
      .get("/api/posts/#{postId}")
      .expect 200, (err, res) ->
        res.body.should.include(POST_DATA)
        res.body.should.have.property '_id'
        res.body['_id'].should.be.eql postId
        done()
        
  it 'should be listed in list', (done) ->
    request(app)
      .get('/api/posts')
      .expect 200, (err, res) ->
        res.body.should.be.an.instanceof Array
        res.body.should.have.length 1
        res.body[0].should.include(POST_DATA)
        done()
    
  it 'should be updated', (done) ->
    request(app)
      .put("/api/posts/#{postId}")
      .send(UPDATED_POST_DATA)
      .expect 200, (err, res) ->
        res.body.should.include(UPDATED_POST_DATA)
        done()
        
  it 'should be persisted after update', (done) ->
    request(app)
      .get("/api/posts/#{postId}")
      .expect 200, (err, res) ->
        res.body.should.include(UPDATED_POST_DATA)
        res.body.should.have.property '_id'
        res.body['_id'].should.be.eql postId
        done()
  
  it 'should be removed', (done) ->
    request(app)
      .del("/api/posts/#{postId}")
      .expect 200, (err, res) ->
        done()
    
  it 'should not be listed after remove', (done) ->
    request(app)
      .get('/api/posts')
      .expect 200, (err, res) ->
        res.body.should.be.an.instanceof Array
        res.body.should.have.length 0
        done()
        
  after cleanDB
      