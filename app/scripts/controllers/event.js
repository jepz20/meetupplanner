'use strict';

/**
 * @ngdoc function
 * @name meetUpPlannerApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the meetUpPlannerApp
 */
angular.module('meetUpPlannerApp')
  .controller('EventCtrl', function ($scope) {
    $scope.minDate = new Date();
    $scope.startDate = new Date();
    $scope.types = ['Normal', 'Party', 'Amazing'];
    $scope.guests = ['Me'];
    $scope.selectedEvent = null;
    $scope.searchText = null;
    $scope.startDateTime;
    $scope.endDateTime;
    $scope.gPlace ={};
    $scope.eventTypes = [{'display': 'Wedding'},
        {'display': 'Birthday'},
        {'display': 'Holy Friday'},
        {'display': 'First Day'},
        {'display': 'Other Type'},
        {'display': 'Forever Alone'},
        {'display': 'Fifiada'}];

    $scope.returnEventTypesResult = function(){
        if ($scope.searchText) {
            return $scope.filterWithSearchText($scope.eventTypes);
        } else {
            return $scope.items;
        }
    };

    $scope.filterWithSearchText = function(items) {
        var matchItems = [];
        for (var i = 0; i < items.length; i++) {
            if (lowercaseComparison(items[i].display, $scope.searchText)) {
                matchItems.push(items[i]);
            }
        }
        return matchItems;
    };

    var lowercaseComparison = function(a ,b) {
        if (angular.lowercase(a).indexOf(angular.lowercase(b)) === 0) {
            return true;
        } else {
            return false;
        }
    };

    $scope.manageDate = function() {
        setEndDatetoStartDateIfNull();
        setStartDatetoEndDateIfNull();
        $scope.manageTime();
    };

    var setEndDatetoStartDateIfNull = function() {
        if (!$scope.endDate) {
            $scope.endDate = $scope.startDate;
        }
    };

    var setStartDatetoEndDateIfNull = function() {
        if (!$scope.startDate) {
            $scope.startDate = $scope.endDate;
        }
    };
    $scope.manageTime = function() {
        setEndTimeBaseOnStartTimeIfNull(1);
        setStartDateTime();
        setEndDateTime();
        setStartDateTimeValidity();
        setEndDateTimeValidity();
    };
    var setEndTimeBaseOnStartTimeIfNull = function(hours) {
        if ($scope.startTime instanceof Date) {
            if (!$scope.endTime) {
                $scope.endTime = new Date();
                $scope.endTime.setTime($scope.startTime.getTime() +
                 (hours*60*60*1000));
            }
        }
    };

    var setStartDateTime = function() {
        $scope.startDateTime = mergeDateTime($scope.startDate,
            $scope.startTime);
    };

    var setEndDateTime = function() {
        $scope.endDateTime = mergeDateTime($scope.endDate,
            $scope.endTime);
    };

    var mergeDateTime = function(date,time) {
        if (date instanceof Date && time instanceof Date) {
            return new Date(date.getFullYear(),
                date.getMonth(),date.getDate(),
                time.getHours(), time.getMinutes());
        } else {
            return null;
        }
    };

    var setStartDateTimeValidity = function() {
        $scope.event.startTime.$setValidity('max',
            checkStartDateTimeGreaterThanEndDateTime());
    };

    var setEndDateTimeValidity = function() {
        $scope.event.endTime.$setValidity('min',
            checkStartDateTimeGreaterThanEndDateTime());
    };

    var checkStartDateTimeGreaterThanEndDateTime = function() {
        if ($scope.startDateTime > $scope.endDateTime) {
            return false;
        } else {
            return true;
        }
    };

    $scope.createEvent = function() {
        console.log($scope.event.$valid);
        if ($scope.event.$valid) {
            console.log('voy a hacer el envio');
        } else {
            $scope.event.$setSubmitted();
        }
    };

    }).directive('googleplace', function() {
    /*base on https://gist.github.com/VictorBjelkholm/6687484*/
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});