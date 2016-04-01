'use strict';

/**
 * @ngdoc function
 * @name meetUpPlannerApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the meetUpPlannerApp
 */
angular.module('meetUpPlannerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.userName = localStorage.getItem('userName');
})