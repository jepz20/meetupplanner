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
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

   $scope.btnRegister = "Register";

   /**
   * @name validatePassword
   * @description
   * validates that user password meet the criteria   
   */
    $scope.validatePassword = function() {
        var password = document.querySelector("#password");
        var checkpassword = document.querySelector("#checkpassword");
        var checkValidityMessagePassword = '';
        var checkValidityMessageCheckPassword = '';
        if (password.value.length < 6     ) {
            checkValidityMessagePassword = checkValidityMessagePassword + 
            "\n" + 
            "Password should have at least 8 characters"
                
        } 
        if (password.value.length > 30) {
            checkValidityMessagePassword = checkValidityMessagePassword + 
            "\n" + 
             "Password should have no more than 30 characters"
            
        }         
        if (!/[0-9]/.test(password.value)) {      
            checkValidityMessagePassword = checkValidityMessagePassword + 
            "\n" + 
             "Please include at least one number"
            
        }
        if (!/[a-z]/.test(password.value)) {      
            checkValidityMessagePassword = checkValidityMessagePassword + 
            "\n" + 
             "Please include at least one lowercase letter"
            
        }
        if (!/[A-Z]/.test(password.value)) {      
            checkValidityMessagePassword = checkValidityMessagePassword + 
            "\n" + 
             "Please include at least one uppercase letter"
            
        }
        if (/[^A-z0-9\!\@\#\$\%\^\&\*]/.test(password.value)) {       
            checkValidityMessagePassword = checkValidityMessagePassword + 
            "\n" + 
             /[^A-z0-9\!\@\#\$\%\^\&\*]/.match(password.value) + "is an illegal character"
            
        }        
        password.setCustomValidity(checkValidityMessagePassword)

        if (password.value !== checkpassword.value) {
            checkValidityMessageCheckPassword = "Password don't match"            
        } else {
            checkValidityMessageCheckPassword ="";            
        }
        checkpassword.setCustomValidity(checkValidityMessageCheckPassword);
        if (checkValidityMessagePassword === "" && checkValidityMessageCheckPassword ==="") {
            return true;            
        } else {
            return false;
        }
   }
   /**
   * @name actRegister
   * @description   
   * register a user if it's new   
   */
   $scope.actRegister = function (entrada) {

        if ($scope.validatePassword()) {
            $location.path("/about");
        };                
   }

   $scope.onSignIn = function(googleUser) {
        console.log("Llegue aqui");
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();        
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
    };

    $scope.authenticate = function(provider) {
        $auth.authenticate(provider)
        .then(function(response) {
            var facebook_response = {};
            facebook_response.token = response.access_token;
            $auth.setToken(facebook_response);
            console.log(response);
        })
        .catch(function(response) {
            console.log("response error:", response);
        })
    }
  });

