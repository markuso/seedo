# Authorization realted middlewares

# Generic require login routing middleware
exports.requiresLogin = (req, res, next) ->
  return res.redirect('/login')  unless req.isAuthenticated()
  next()


# User authorization routing middleware
exports.user =
  
  hasAuthorization: (req, res, next) ->
    unless req.profile.id is req.user.id
      req.flash 'info', 'You are not authorized'
      return res.redirect('/users/' + req.profile.id)
    next()


# Post authorization routing middleware
exports.post =
  
  hasAuthorization: (req, res, next) ->
    unless req.post.user.id is req.user.id
      req.flash 'info', 'You are not authorized'
      return res.redirect('/posts/' + req.post.id)
    next()