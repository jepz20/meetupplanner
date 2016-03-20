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
        if (password.value.length < 6     ) {
            checkValidityMessagePassword = checkValidityMessagePassword +
            '\n' +
            'Password should have at least 8 characters';

        }
        if (password.value.length > 30) {
            checkValidityMessagePassword = checkValidityMessagePassword +
            '\n' +
             'Password should have no more than 30 characters';

        }
        if (!/[0-9]/.test(password.value)) {
            checkValidityMessagePassword = checkValidityMessagePassword +
            '\n' +
             'Please include at least one number';

        }
        if (!/[a-z]/.test(password.value)) {
            checkValidityMessagePassword = checkValidityMessagePassword +
            '\n' +
             'Please include at least one lowercase letter';

        }
        if (!/[A-Z]/.test(password.value)) {
            checkValidityMessagePassword = checkValidityMessagePassword +
            '\n' +
             'Please include at least one uppercase letter';

        }
        if (/[^A-z0-9\!\@\#\$\%\^\&\*]/.test(password.value)) {
            checkValidityMessagePassword = checkValidityMessagePassword +
            '\n' +
             /[^A-z0-9\!\@\#\$\%\^\&\*]/.match(password.value) + 'is an illegal character';

        }
        password.setCustomValidity(checkValidityMessagePassword);

        if (password.value !== checkpassword.value) {
            checkValidityMessageCheckPassword = 'Password do not match';
        } else {
            checkValidityMessageCheckPassword ='';
        }
        checkpassword.setCustomValidity(checkValidityMessageCheckPassword);
        if (checkValidityMessagePassword === '' && checkValidityMessageCheckPassword ==='') {
            return true;
        } else {
            return false;
        }
    };

    /**
    * @name actRegister
    * @description
    * register a user if it's new
    */
    $scope.actRegister = function () {

        if ($scope.validatePassword()) {
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

