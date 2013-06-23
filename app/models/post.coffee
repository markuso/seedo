# Post model

mongoose = require 'mongoose'

###
Post Schema
###

PostSchema = new mongoose.Schema(
  title: String
  body: String
  slug: String
  created: { type: Date, default: Date.now }
  updated: { type: Date, default: Date.now }
)

###
Pre-save hook
###

PostSchema.pre 'save', (next) ->
  @updated = new Date
  next()

mongoose.model 'Post', PostSchema
