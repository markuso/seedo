'use strict';

angular.module('App', [])
  .config([
    '$routeProvider', function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: '/partials/main',
        controller: 'MainCtrl'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]);
