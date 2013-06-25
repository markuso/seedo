'use strict';

/*!
 * Authorization middlewares
 */

exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};

exports.user = {
  hasAuthorization: function(req, res, next) {
    if (req.profile.id !== req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/users/' + req.profile.id);
    }
    next();
  }
};

exports.post = {
  hasAuthorization: function(req, res, next) {
    if (req.post.user.id !== req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/posts/' + req.post.id);
    }
    next();
  }
};
