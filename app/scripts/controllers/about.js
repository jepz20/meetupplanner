'use strict';

/**
 * @ngdoc function
 * @name meetUpPlannerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the meetUpPlannerApp
 */
angular.module('meetUpPlannerApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.minDate = new Date();
    $scope.types = ['Normal', 'Party', 'Amazing'];
    $scope.guests = [];
  });
