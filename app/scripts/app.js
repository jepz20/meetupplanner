'use strict';

/**
 * @ngdoc overview
 * @name meetUpPlannerApp
 * @description
 * # meetUpPlannerApp
 *
 * Main module of the application.
 */
angular
  .module('meetUpPlannerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'satellizer',
    'ngMaterial'
  ])
  .config(function ($routeProvider,$authProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
      $authProvider.facebook({
        clientId: '903607643089946',
        scope: ['email']
      });

      $authProvider.google({
        clientId: '4393999410-hiip54bd4d46mn7f7p1no5gtp0cv0fgn.apps.googleusercontent.com'
      });
  });
