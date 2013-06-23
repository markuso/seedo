# Default controller

module.exports = 

  # Render the index page
  index: (req, res) ->
    res.render 'index',
      title: ''

  # Render the client app file
  client: (req, res) ->
    res.render 'app'

  # Send a partial template for client side rendering
  partial: (req, res) ->
    res.render "partials/#{req.params.name}"
