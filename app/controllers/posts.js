'use strict';

/*!
 * Post controllers
 */

var mongoose = require('mongoose');
var Post = mongoose.model('Post');

module.exports = {

  all: function(req, res) {
    Post.find({}, function(err, posts) {
      res.send(posts);
    });
  },

  get: function(req, res) {
    Post.findById(req.params.id, function(err, post) {
      if (err) return res.send(500, err);
      res.send(post);
    });
  },

  create: function(req, res) {
    var post = new Post(req.body);
    post.save(function(err, post) {
      if (err) return res.send(500, err);
      res.send(post);
    });
  },

  update: function(req, res) {
    Post.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, post) {
      if (err) return res.send(500, err);
      res.send(post);
    });
  },

  delete: function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.send(500, err);
      res.send({});
    });
  }

};
