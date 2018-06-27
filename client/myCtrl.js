angular.module('citiesApp')
 .controller('myCtrl', ['$window', '$location','setToken', '$http','$scope', '$rootScope','localStorageModel', function($window, $location,setToken, $http, $scope, $rootScope,localStorageModel) {
    /*variables*/
    $rootScope.isLoggedIn = false;
    let serverUrl = 'http://localhost:3000/';
    $rootScope.CurrentUsername = "Guest";
    $rootScope.defaultUser = {
        Username: "Guest"
    };
    $rootScope.User = {
        Categories: ['Museums', 'Restaurants']
    };
    $("#goUpArrow").hide();

    //check if login button was clicked
    $scope.onClickLogin = function() {
        $scope.loginClicked = !$scope.loginClicked;
    }
    //check if other parts of the windows that is not login was pressed (to hide the login window)
    $scope.onClickOtherForLogin = function() {
        $scope.loginClicked = false;
    }

    //login handle function
    $scope.login = function() {
        isValid = true;
        if(isValid) {
            $http.post(serverUrl +"users/login", JSON.stringify($rootScope.User))
            .then(function(response){
                $scope.loginClicked = false;
                setToken.set(response.data.token);
                $rootScope.CurrentUsername = $rootScope.User.Username;
                $rootScope.isLoggedIn = true;
                localStorageModel.set('token',response.data.token);
                $location.path( "/" );
            },function(response){
                alert(response.data.message);
            });
        } else {
            alert("Absolutely not..");
        }
    }

    //scroll up function
    $scope.scrollUp = function() {
        $("#goUpArrow").hide();
        var scrollDuration = 500;
        var scrollStep = -window.scrollY / (scrollDuration / 15);
        console.log(scrollStep);
            
        var scrollInterval = setInterval(function(){  
          if (window.scrollY != 0) {
            window.scrollBy(0, scrollStep);
          } else {
            clearInterval(scrollInterval); 
          }
        },15);		
    }

    //interval for showing the scrollup button if not at top of the window (not working)
    setInterval(function(){  
        if (window.scrollY != 0) {
            $("#goUpArrow").show();
        }
        else {
            $("#goUpArrow").hide();
        }
      },2000);     

}]);

