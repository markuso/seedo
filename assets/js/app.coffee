'use strict'

angular.module('App', [])

  .config ['$routeProvider', ($routeProvider) ->
    
    $routeProvider
      .when '/',
        templateUrl: '/partials/main'
        controller:  'MainCtrl'
      .otherwise
        redirectTo: '/'

  ]
