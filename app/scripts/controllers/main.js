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
   {'type': 'passwordmatch', 'text': 'Password do not match'}];
   /**
   * @name validatePassword
   * @description
   * validates that user password meet the criteria
   */
    $scope.validatePassword = function() {
        var password = document.querySelector('#password');
        var checkpassword = document.querySelector('#checkpassword');
        var checkValidityMessagePassword = '';
        var checkValidityMessageCheckPassword = '';
        var validPassword = true;
        // $scope.register.password.$error.minlength = false;
        // $scope.register.password.$error.maxlength = false;
        $scope.register.password.$error.includenumber = false;
        $scope.register.password.$error.includelowercase = false;
        $scope.register.password.$error.includeuppercase = false;
        $scope.register.password.$error.illegalchar = false;
        // $scope.register.checkpassword.$error.passwordmatch = false;

        if (!/[0-9]/.test(password.value)) {
            $scope.register.password.$error.includenumber = true;
            validPassword = false;
        }
        if (!/[a-z]/.test(password.value)) {
            $scope.register.password.$error.includelowercase = true;
            validPassword = false;

        }
        if (!/[A-Z]/.test(password.value)) {
            $scope.register.password.$error.includeuppercase = true;
            validPassword = false;
        }

        if (password.value !== checkpassword.value) {
            // $scope.register.checkpassword.$error.passwordmatch = true;
        } else {
            checkValidityMessageCheckPassword ='';
        }
        // checkpassword.setCustomValidity(checkValidityMessageCheckPassword);
        $scope.register.password.$valid = validPassword;
        console.log($scope.register.password.$valid );
        return !validPassword;

    };

    /**
    * @name actRegister
    * @description
    * register a user if it's new
    */
    $scope.actRegister = function () {
        console.log($scope.register.$valid);
        console.log($scope.register.password.$valid);
        $scope.validatePassword()
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



