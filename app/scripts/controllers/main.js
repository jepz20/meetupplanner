'use strict';

/**
 * @ngdoc function
 * @name meetUpPlannerApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the meetUpPlannerApp
 */
angular.module('meetUpPlannerApp')
.controller('MainCtrl', function(User, Navigation) {
    var main = this;
    main.user = User;
    main.user.get();

    main.logout = function() {
        main.user.logout();
    };

    main.goToHome = function() {
        Navigation.home(main.user.loggedIn);
    };
})
;

