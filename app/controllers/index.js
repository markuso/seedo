'use strict';

/*!
 * Index controllers
 */

module.exports = {

  index: function(req, res) {
    res.render('index', {
      title: ''
    });
  },

  client: function(req, res) {
    res.render('app');
  },

  partial: function(req, res) {
    res.render("partials/" + req.params.name);
  }

};
