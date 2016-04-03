'use strict';

angular.module('meetUpPlannerApp')
.service('User', function User(Navigation){
    var User = this;
    User.data ={};
    User.data.name = '';
    User.data.firstName = '';
    User.loggedIn = false;
    User.data.email = '';
    User.get = function() {
        if (localStorage.getItem('userName') && localStorage.getItem('userEmail')) {
            User.data.name = localStorage.getItem('userName');
            User.data.firstName = getFirstName();
            User.data.email = localStorage.getItem('userEmail');
            User.loggedIn = true;
        } else {
            User.data.name = '';
            User.data.firstName = '';
            User.data.email = '';
            User.loggedIn = false;
        }
        return User.data;
    };
    User.login = function(user) {
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        User.data.name = user.name;
        User.data.email = user.email;
        User.data.firstName = getFirstName();
        User.loggedIn = true;
        Navigation.showEvents(true);
    };

    User.logout = function() {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        User.data.name = '';
        User.data.firstName = '';
        User.data.email = '';
        Navigation.signup();
        User.loggedIn = false;
    };

    var getFirstName = function() {
        return User.data.name.split(' ')[0];
    };
});