'use strict';

angular.module('meetUpPlannerApp')
.service('User', function User(Navigation, $firebaseObject){
    var User = this;
    var firebaseUrl = 'https://popping-heat-5589.firebaseio.com/users/';

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
        storeUser(user);
        Navigation.showEvents(true);
    };

    User.signup = function(user) {
        storeUser(user);
        Navigation.completebio();
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

    User.updateBio = function(user, bio_param) {
        var email = user.data.email;
        email = email.replace('@','at').replace(/./g,'dot');
        var firebaseUserRef = new Firebase(firebaseUrl + email);
        var firebaseUser = $firebaseObject(firebaseUserRef);
        firebaseUser.$loaded().then(function() {
            if (!firebaseUser.bio) {
                firebaseUser.bio = {};
            }
            if (bio_param.employer && bio_param.employer != '') {
                firebaseUser.bio.employer = bio_param.employer;
            }
            if (bio_param.jobTitle && bio_param.jobTitle != '') {
                firebaseUser.bio.jobTitle = bio_param.jobTitle;
            }
            if (bio_param.birthdate && bio_param.birthdate != '') {
                firebaseUser.bio.birthdate = bio_param.birthdate.getTime();
            }        

            firebaseUser.$save().then(function() {
                Navigation.home(true);
            });
        });
    }

    var getFirstName = function() {
        return User.data.name.split(' ')[0];
    };

    var storeUser = function(user) {
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        User.data.name = user.name;
        User.data.email = user.email;
        User.data.firstName = getFirstName();
        User.loggedIn = true;
    }

});