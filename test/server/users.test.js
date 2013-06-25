'use strict';

/*!
 * User model tests
 */

var request  = require('supertest');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var app = require(process.cwd() + '/app');

var INITIAL_DATA = {
  name: 'Joe Nice',
  username: 'joe.nice',
  email: 'joe.nice@example.com',
  password: 'mypass'
};

var VERIFY_DATA = {
  name: 'Joe Nice',
  username: 'joe.nice',
  email: 'joe.nice@example.com'
};

var UPDATED_DATA = {
  name: 'Joe Mean',
  username: 'joe.mean',
  email: 'joe.mean@example.com'
};

var cleanDB = function(done) {
  User.remove({}, function() {
    done();
  });
};

describe('User', function() {
  var userId = null;

  before(cleanDB);

  it('should be created', function(done) {
    var user = new User(INITIAL_DATA);
    user.save(function(err, user) {
      if (err) return done(err);
      user.should.include(VERIFY_DATA);
      user.should.have.property('_id');
      user['_id'].should.be.ok;
      userId = user['_id'];
      done();
    });
    // We can't use the following since we don't return JSON from that resource
    // request(app).post('/api/users').send(INITIAL_DATA).expect(201, function(err, res) {
    //   res.body.should.include(INITIAL_DATA);
    //   res.body.should.have.property('_id');
    //   res.body['_id'].should.be.ok;
    //   userId = res.body['_id'];
    //   done();
    // });
  });

  it('should be accessible by id', function(done) {
    request(app).get('/api/users/' + userId).expect(200, function(err, res) {
      res.body.should.include(VERIFY_DATA);
      res.body.should.have.property('_id');
      // res.body['_id'].should.be.eql(userId);
      done();
    });
  });

  it('should be listed in list', function(done) {
    request(app).get('/api/users').expect(200, function(err, res) {
      res.body.should.be.an.instanceof(Array);
      res.body.should.have.length(1);
      res.body[0].should.include(VERIFY_DATA);
      done();
    });
  });

  it('should be updated', function(done) {
    request(app).put('/api/users/' + userId).send(UPDATED_DATA).expect(200, function(err, res) {
      res.body.should.include(UPDATED_DATA);
      done();
    });
  });

  it('should be persisted after update', function(done) {
    request(app).get('/api/users/' + userId).expect(200, function(err, res) {
      res.body.should.include(UPDATED_DATA);
      res.body.should.have.property('_id');
      // res.body['_id'].should.be.eql(userId);
      done();
    });
  });

  // it('should be removed', function(done) {
  //   request(app).del('/api/users/' + userId).expect(200, function(err, res) {
  //     done();
  //   });
  // });

  // it('should not be listed after remove', function(done) {
  //   request(app).get('/api/users').expect(200, function(err, res) {
  //     res.body.should.be.an.instanceof(Array);
  //     res.body.should.have.length(0);
  //     done();
  //   });
  // });

  after(cleanDB);
  
});
