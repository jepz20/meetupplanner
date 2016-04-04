'use strict';

/**
 * @ngdoc function
 * @name meetUpPlannerApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the meetUpPlannerApp
 */
angular.module('meetUpPlannerApp')
.controller('EventCtrl', function (Navigation, $firebaseArray, User, $scope,
    $mdToast, $window) {
    var event = this;
    event.user = User;
    if (!event.user.loggedIn) {
        Navigation.signup();
    }
    event.minDate = new Date();
    event.startDate = new Date();
    event.endDate = new Date();
    event.startDateTime;
    event.endDateTime;
    event.gPlace ={};
    event.types = [
        {'display': 'Conference'},
        {'display': 'Meeting'},
        {'display': 'Sport'},
        {'display': 'Videogame'},
        {'display': 'Networking'},
        {'display': 'Party'},
        {'display': 'Wedding'},
        {'display': 'Birthday'},
        {'display': 'Family'},
        {'display': 'Other'}

    ];
    event.guests = [event.user.data.firstName];
    event.host = event.user.data.name;
    event.type = event.types[0].display;
    event.firebaseEvents = new Firebase('https://popping-heat-5589.firebaseio.com/events');

    event.manageDate = function() {
        setEndDatetoStartDateIfNull();
        setStartDatetoEndDateIfNull();
        event.manageTime();
    };

    var setEndDatetoStartDateIfNull = function() {
        if (!event.endDate && !$scope.eventForm.endDate ) {
            event.endDate = event.startDate;
        }
    };

    var setStartDatetoEndDateIfNull = function() {
        if (!event.startDate && !$scope.eventForm.startDate) {
            event.startDate = event.endDate;
        }
    };
    event.manageTime = function() {
        setEndTimeBaseOnStartTimeIfNull(1);
        setStartDateTime();
        setEndDateTime();
        setStartDateTimeValidity();
        setEndDateTimeValidity();
    };
    var setEndTimeBaseOnStartTimeIfNull = function(hours) {
        if (event.startTime instanceof Date) {
            if (!event.endTime) {
                event.endTime = new Date();
                event.endTime.setTime(event.startTime.getTime() +
                 (hours*60*60*1000));
            }
        }
    };

    var setStartDateTime = function() {
        event.startDateTime = mergeDateTime(event.startDate,
            event.startTime);
    };

    var setEndDateTime = function() {
        event.endDateTime = mergeDateTime(event.endDate,
            event.endTime);
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
        $scope.eventForm.startTime.$setValidity('max',
            checkStartDateTimeGreaterThanEndDateTime());
    };

    var setEndDateTimeValidity = function() {
        $scope.eventForm.endTime.$setValidity('min',
            checkStartDateTimeGreaterThanEndDateTime());
    };

    var checkStartDateTimeGreaterThanEndDateTime = function() {
        if (event.startDateTime > event.endDateTime) {
            return false;
        } else {
            return true;
        }
    };

    event.gotToCreateEvent = function() {
        Navigation.createEvent(event.user.loggedIn);
    };
    event.openMap = function(location) {
        var url = 'http://maps.google.com/maps?q='+location[0]+','+location[1];
        $window.open(url, '_blank');
    }

    event.cancelEvent = function() {
        Navigation.showEvents(event.user.loggedIn);
    };
    event.createEvent = function() {
        if (validateEventForm()) {
            event.firebaseEvents.push(createEventJson());
            Navigation.showEvents(event.user.loggedIn);
        }
    };

    var createEventJson = function() {
        var description = (typeof event.description === 'undefined') ? '' : event.description;
        var eventJson = { 'name': event.name,
                'host': event.host,
                'type': event.type,
                'location': event.location,
                'detailLocation': $scope.detailLocation,
                'startDateTime': event.startDateTime.getTime(),
                'endDateTime': event.endDateTime.getTime(),
                'guests': event.guests,
                'description': description,
                'createDate': (new Date()).getTime(),
                'createdBy': event.user.data.email
            };
        return eventJson;
    };
    event.showToast = function() {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Please add a guest')
            .position('bottom right')
            .hideDelay(3000)
        );
    };
    var validateEventForm = function() {
        if (!$scope.eventForm.$valid) {
            $scope.eventForm.$setSubmitted();
            return false;
        }
        if (event.guests.length===0) {
            event.showToast();
            return false;
        }
        return true;
    };

    $scope.showAll = true;
    event.getAllEvents = function() {
        if ($scope.showAll) {
            query = event.firebaseEvents;
        } else {
            var query = event.firebaseEvents.orderByChild('createdBy').equalTo(event.user.data.email);
        }
        event.allEvents = $firebaseArray(query);
    };

})
.directive('googleplace', function() {
    /*base on https://gist.github.com/VictorBjelkholm/6687484*/
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(
                element[0], options
            );

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                var geoComponents = scope.gPlace.getPlace();
                var latitude = geoComponents.geometry.location.lat();
                var longitude = geoComponents.geometry.location.lng();
                var detailLocation = [];
                detailLocation.push(latitude, longitude);
                scope.detailLocation = detailLocation;
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});