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
    $window) {
    var event = this;
    event.user = User;
    if (!event.user.loggedIn) {
        Navigation.signup();
    }
    event.minDate = new Date();
    event.startDate = new Date();
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
    event.guests = [];
    event.host = event.user.data.name;
    event.type = event.types[0].display;
    event.firebaseEvents = new Firebase('https://popping-heat-5589.firebaseio.com/events');

    var setEndDatetoStartDateIfNull = function() {
        if (!event.endDate && !$scope.eventForm.endDate.$viewValue ) {
            event.endDate = event.startDate;
        }
    };

    var setStartDatetoEndDateIfNull = function() {
        if (!event.startDate && !$scope.eventForm.startDate.$viewValue) {
            event.startDate = event.endDate;
        }
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

    event.manageDate = function() {
        setEndDatetoStartDateIfNull();
        setStartDatetoEndDateIfNull();
        event.manageTime();
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

    var setStartDateTime = function() {
        event.startDateTime = mergeDateTime(event.startDate,
            event.startTime);
    };

    var setEndDateTime = function() {
        event.endDateTime = mergeDateTime(event.endDate,
            event.endTime);
    };

    var checkStartDateTimeGreaterThanEndDateTime = function() {
        if (event.startDateTime > event.endDateTime) {
            return false;
        } else {
            return true;
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


    event.manageTime = function() {
        setEndTimeBaseOnStartTimeIfNull(1);
        setStartDateTime();
        setEndDateTime();
        setStartDateTimeValidity();
        setEndDateTimeValidity();
    };


    event.gotToCreateEvent = function() {
        Navigation.createEvent(event.user.loggedIn);
    };
    event.openMap = function(location) {
        var url = 'http://maps.google.com/maps?q='+location[0]+','+location[1];
        $window.open(url, '_blank');
    };

    event.cancelEvent = function() {
        Navigation.showEvents(event.user.loggedIn);
    };

    var removeGuestsDuplicates = function() {
        /*base on http://codereview.stackexchange.com/questions/60128/removing-duplicates-from-an-array-quickly*/
        var a = [];
        for ( var i = 0; i < event.guests.length; i++ ) {
            var current = event.guests[i];
            if (a.indexOf(current) < 0) {
                a.push(current);
            }
        }
        event.guests = a;
    };

    var createEventJson = function() {
        var description = (typeof event.description === 'undefined') ? '' : event.description;
        event.guest = event.guest.replace(/(^,)|(,$)/g, '');
        event.guests = event.guest.split(',');
        removeGuestsDuplicates();
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

    var validateEventForm = function() {
        if (!$scope.eventForm.$valid) {
            $scope.eventForm.$setSubmitted();
            return false;
        }
        return true;
    };

    event.createEvent = function() {
        if (validateEventForm()) {
            event.firebaseEvents.push(createEventJson());
            Navigation.showEvents(event.user.loggedIn);
        }
    };


    var validateDuplicateComma = function() {
        var duplicateComa = (/(,)\1+$/).test(event.guest);
        $scope.eventForm.guests.$setValidity('duplicatecomma',
            !duplicateComa);
    };

    var validateGuestMinLength = function(guest) {
        if (guest.length < 3) {
            $scope.eventForm.guests.$setValidity('min',
                false);            
        }        
    };

    var validateGuestHasLetters = function(guest) {
        var validPattern = (/^(?=.*[a-zA-Z]).+$/).test(guest);
        $scope.eventForm.guests.$setValidity('letters',
            validPattern);        
    };

    event.validateGuestList = function() {
        validateDuplicateComma();
        event.guests = event.guest.replace(/(^,)|(,$)/g, '').split(',');
        $scope.eventForm.guests.$setValidity('min',
            true);
        $scope.eventForm.guests.$setValidity('letters',
            true); 
        for (var i = event.guests.length - 1; i >= 0; i--) {
            validateGuestMinLength(event.guests[i]);
            validateGuestHasLetters(event.guests[i]);
        }     
    };

    $scope.showAll = false;
    event.getAllEvents = function() {
        var query;
        if ($scope.showAll) {
            query = event.firebaseEvents;
        } else {
            query = event.firebaseEvents.orderByChild('createdBy').equalTo(event.user.data.email);
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