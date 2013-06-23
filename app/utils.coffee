module.exports =

  # Converts mongoose errors object into an array
  errors: (errors) ->
    keys = Object.keys(errors)
    return ['Oops! There was an error']  unless keys
    list = []
    keys.forEach (key) ->
      list.push errors[key].type
    return list
