'use strict';

angular.module('meetUpPlannerApp')
.service('Navigation', function($location) {
    var self = this;

    self.home = function(loggedIn) {
        self.showEvents(loggedIn);
    };

    self.showEvents = function(loggedIn) {
        if (loggedIn) {
            $location.path('/');
        } else {
            self.signup();
        }
    };

    self.createEvent = function(loggedIn) {
        if (loggedIn) {
            $location.path('/event/create');
        } else {
            self.signup();
        }
    };

    self.signup = function() {
        $location.path('/signup');
    };
});