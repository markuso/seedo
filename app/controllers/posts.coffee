# Post controllers

mongoose   = require 'mongoose'
Post       = mongoose.model 'Post'

module.exports = 

  # Lists all posts
  all: (req, res) ->
    Post.find {}, (err, posts) ->
      res.send posts
        
  # Gets post by id
  get: (req, res) ->
    Post.findById req.params.id, (err, post) ->
      if not err
        res.send post
      else
        res.send 500, err
      
  # Creates new post with data from `req.body`
  create: (req, res) ->
    post = new Post req.body
    post.save (err, post) ->
      if not err
        res.send post
      else
        res.send 500, err
             
  # Updates post with data from `req.body`
  update: (req, res) ->
    Post.findByIdAndUpdate req.params.id, { $set: req.body }, (err, post) ->
      if not err
        res.send post
      else
        res.send 500, err
    
  # Deletes post by id
  delete: (req, res) ->
    Post.findByIdAndRemove req.params.id, (err) ->
      if not err
        res.send {}
      else
        res.send 500, err
