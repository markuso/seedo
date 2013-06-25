'use strict';

/*!
 * General App level tests
 */

var request = require('supertest');
var app = require(process.cwd() + '/app');

describe('General Tests', function() {
  
  it('should render main page', function(done) {
    request(app).get('/').expect(200, function(err, res) {
      done();
    });
  });

  it('should return 404 for invalid API call', function(done) {
    request(app).get('/api/nonexistent').expect(404, function(err, res) {
      done();
    });
  });

});
