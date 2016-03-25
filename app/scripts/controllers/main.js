'use strict';

/**
 * @ngdoc function
 * @name meetUpPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the meetUpPlannerApp
 */
angular.module('meetUpPlannerApp')
  .controller('MainCtrl', function ($scope, $location, $auth) {

   $scope.btnRegister = 'Register';
   $scope.btnSignUpFacebook = 'Sign up with Facebook';
   $scope.btnSignUpGoogle = 'Sign up with Google';
   $scope.errorMessages = [{'type': 'minlength', 'text': 'Password should have at least 8 characters'},
   {'type': 'maxlength', 'text': 'Password should have no more than 30 characters'},
   {'type': 'includenumber', 'text': 'Please include at least one number'},
   {'type': 'includelowercase', 'text': 'Please include at least one lowercase letter'},
   {'type': 'includeuppercase', 'text': 'Please include at least one uppercase letter'},
   {'type': 'passwodrdmatch', 'text': 'Password do not match'}];


   /**
   * @name checkIfIncludeNumber
   * @description
   * checks if a string contains a number
   * @param stringToValidate
   */

   var checkIfIncludeNumber = function(stringToValidate) {
        if (/[0-9]/.test(stringToValidate)) {
            return true;
        } else {
            return false;
        }
   };

   /**
   * @name checkIfIncludLowerCase
   * @description
   * checks if a string contains a lowercase letter
   * @param stringToValidate
   */

    var checkIfIncludeLowercase = function(stringToValidate) {
        if (/[a-z]/.test(stringToValidate)) {
            return true;
        } else {
            return false;
        }
    };

   /**
   * @name checkIfIncludUppercase
   * @description
   * checks if a string contains an uppercase letter
   * @param stringToValidate
   */

    var checkIfIncludeUppercase = function(stringToValidate) {
        if (/[A-Z]/.test(stringToValidate)) {
            return true;
        } else {
            return false;
        }
    };


   /**
   * @name validatePassword
   * @description
   * validates that user password meet the criteria
   */
    $scope.setPasswordValidity = function() {
        $scope.register.password.$setValidity('includenumber',
            checkIfIncludeNumber($scope.password));
        $scope.register.password.$setValidity('includelowercase',
            checkIfIncludeLowercase($scope.password));
        $scope.register.password.$setValidity('includeuppercase',
            checkIfIncludeUppercase($scope.password));
        $scope.setCheckPasswordValidity();
    };

    /**
    * @name checkIfPasswordMatch
    * @description
    * check if password fields matches
    * @param password
    * @param checkPassword
    */

    var checkIfPasswordMatch = function(password, checkPassword) {
        if (password !== checkPassword) {
            return false;
        } else {
            return true;
        }
    };

    /**
    * @name setCheckPasswordValidity
    * @description
    * validates if password and checkpassword fields matches
    * @param password
    * @param checkPassword
    */

    $scope.setCheckPasswordValidity = function () {
        $scope.register.checkpassword.$setValidity('passwordmatch',
            checkIfPasswordMatch($scope.password, $scope.checkPassword));
    };

    /**
    * @name actRegister
    * @description
    * register a user if it's new
    */
    $scope.actRegister = function () {
        if ($scope.register.$valid) {
            var user = {
                name: $scope.usrname,
                password: $scope.password,
                email: $scope.usremail
            };
            $auth.signup(user)
            .then(function (response) {
                $location.path('/about');
            });
        } else {
            console.log('Invalid form');
        }
    };

    $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
        .then(function(response) {
            $location.path('/about');
        })
        .catch(function(response) {
            console.log('response error:', response);
        });
    };
  });



