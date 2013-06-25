/*!
 * Post schema and model
 */

var mongoose = require('mongoose');


/**
 * Post Schema
 */

var PostSchema = new mongoose.Schema({
  title: String,
  body: String,
  slug: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});


/**
 * Pre-save hook
 */

PostSchema.pre('save', function(next) {
  this.updated = new Date;
  next();
});


/**
 * Create the mongoose model
 */

mongoose.model('Post', PostSchema);
