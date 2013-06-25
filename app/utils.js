/*!
 * Utilities
 */

module.exports = {

  errors: function(errors) {
    var keys, list;
    keys = Object.keys(errors);
    if (!keys) return ['Oops! There was an error'];
    list = [];
    keys.forEach(function(key) {
      list.push(errors[key].type);
    });
    return list;
  }

};
