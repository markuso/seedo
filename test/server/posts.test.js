'use strict';

/*!
 * Post model tests
 */

var request  = require('supertest');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var app = require(process.cwd() + '/app');

var INITIAL_DATA = {
  title: 'Some Title',
  body: 'body of post',
  slug: 'some-url'
};

var UPDATED_DATA = {
  title: 'Another title',
  body: 'another body of post',
  slug: 'some-another-url'
};

var cleanDB = function(done) {
  Post.remove({}, function() {
    done();
  });
};

describe('Post', function() {
  var postId = null;

  before(cleanDB);

  it('should be created', function(done) {
    request(app).post('/api/posts').send(INITIAL_DATA).expect(201, function(err, res) {
      res.body.should.include(INITIAL_DATA);
      res.body.should.have.property('_id');
      res.body['_id'].should.be.ok;
      postId = res.body['_id'];
      done();
    });
  });

  it('should be accessible by id', function(done) {
    request(app).get('/api/posts/' + postId).expect(200, function(err, res) {
      res.body.should.include(INITIAL_DATA);
      res.body.should.have.property('_id');
      res.body['_id'].should.be.eql(postId);
      done();
    });
  });

  it('should be listed in list', function(done) {
    request(app).get('/api/posts').expect(200, function(err, res) {
      res.body.should.be.an.instanceof(Array);
      res.body.should.have.length(1);
      res.body[0].should.include(INITIAL_DATA);
      done();
    });
  });

  it('should be updated', function(done) {
    request(app).put('/api/posts/' + postId).send(UPDATED_DATA).expect(200, function(err, res) {
      res.body.should.include(UPDATED_DATA);
      done();
    });
  });

  it('should be persisted after update', function(done) {
    request(app).get('/api/posts/' + postId).expect(200, function(err, res) {
      res.body.should.include(UPDATED_DATA);
      res.body.should.have.property('_id');
      res.body['_id'].should.be.eql(postId);
      done();
    });
  });

  it('should be removed', function(done) {
    request(app).del('/api/posts/' + postId).expect(200, function(err, res) {
      done();
    });
  });

  it('should not be listed after remove', function(done) {
    request(app).get('/api/posts').expect(200, function(err, res) {
      res.body.should.be.an.instanceof(Array);
      res.body.should.have.length(0);
      done();
    });
  });

  after(cleanDB);

});
