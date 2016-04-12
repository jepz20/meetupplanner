'use strict';

/**
 * @ngdoc function
 * @name meetUpPlannerApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the meetUpPlannerApp
 */
angular.module('meetUpPlannerApp')
.controller('SignupCtrl', function ($scope, $auth, User, Navigation) {
    $scope.errorMessages = [
        {'type': 'minlength', 'text': 'Password should have at least 8 characters'},
        {'type': 'maxlength', 'text': 'Password should have no more than 30 characters'},
        {'type': 'includenumber', 'text': 'Please include at least one number'},
        {'type': 'includelowercase', 'text': 'Please include at least one lowercase letter'},
        {'type': 'includeuppercase', 'text': 'Please include at least one uppercase letter'},
        {'type': 'passwodrdmatch', 'text': 'Password do not match'},
        {'type': 'required', 'text': 'Please enter your password'}
    ];
    $scope.user = User;
    if (Navigation.whereAmI() !== '/signup') {
        if (!$scope.user.loggedIn) {
            Navigation.signup();
        }
    } else {
        if ($scope.user.loggedIn) {
            Navigation.home(true);
        }        
    }
    $scope.showSignUp = false;
    $scope.today = new Date();
    $scope.toggleShowSignUpForm = function() {
        $scope.showSignUp = !$scope.showSignUp;
    };

    var checkIfIncludeNumber = function(stringToValidate) {
        if (/[0-9]/.test(stringToValidate)) {
            return true;
        } else {
            return false;
        }
    };


    var checkIfIncludeLowercase = function(stringToValidate) {
        if (/[a-z]/.test(stringToValidate)) {
            return true;
        } else {
            return false;
        }
    };


    var checkIfIncludeUppercase = function(stringToValidate) {
        if (/[A-Z]/.test(stringToValidate)) {
            return true;
        } else {
            return false;
        }
    };


    $scope.setPasswordValidity = function() {
        $scope.register.password.$setValidity('includenumber',
            checkIfIncludeNumber($scope.password));
        $scope.register.password.$setValidity('includelowercase',
            checkIfIncludeLowercase($scope.password));
        $scope.register.password.$setValidity('includeuppercase',
            checkIfIncludeUppercase($scope.password));
        $scope.setCheckPasswordValidity();
    };


    var checkIfPasswordMatch = function(password, checkPassword) {
        if (password !== checkPassword) {
            return false;
        } else {
            return true;
        }
    };


    $scope.setCheckPasswordValidity = function () {
        $scope.register.checkpassword.$setValidity('passwordmatch',
            checkIfPasswordMatch($scope.password, $scope.checkPassword));
    };


    $scope.signupUser = function () {
        if ($scope.register.$valid) {
            var user = {
                name: $scope.usrname,
                password: $scope.password,
                email: $scope.usremail
            };
            $auth.signup(user)
            .then(function (response) {
                User.signup(response.data);
            })
            .catch(function() {
                $scope.authError = true;
            });
        } else {
            $scope.register.$setSubmitted();
        }
    };

    $scope.updateUserBio = function() {
        if ($scope.biography.$valid) {
            var bio = {};
            bio.employer = $scope.employer;
            bio.jobTitle = $scope.jobTitle;
            bio.birthdate = $scope.birthdate;
            User.updateBio($scope.user, bio);
        } else {
            $scope.biography.$setSubmitted();
        }
    };

    $scope.goHome = function() {
        Navigation.home(true);
    };

    $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
        .then(function(response) {
            User.signup(response.data);
        })
        .catch(function() {
        });
    };
});



