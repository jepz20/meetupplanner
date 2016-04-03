'use strict';

/**
 * @ngdoc overview
 * @name meetUpPlannerApp
 * @description
 * # meetUpPlannerApp
 *
 * Main module of the application.
 */
angular.module('meetUpPlannerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ngMessages',
    'satellizer',
    'firebase'
])
.config(function ($routeProvider,$authProvider) {
    $routeProvider
    .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
    })
    .when('/event/create', {
        templateUrl: 'views/event_create.html',
        controller: 'EventCtrl',
        controllerAs: 'event'
    })
    .when('/', {
        templateUrl: 'views/event_show.html',
        controller: 'EventCtrl',
        controllerAs: 'event'
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
