angular.module('citiesApp')
 .controller('myCtrl', ['loginService', '$window', '$location','setToken', '$http','$scope', '$rootScope','localStorageModel', function(loginService, $window, $location,setToken, $http, $scope, $rootScope,localStorageModel) {
    /*variables*/
    $rootScope.isLoggedIn = false;
    let serverUrl = 'http://localhost:3000/';
    $rootScope.CurrentUsername = "Guest";
    loginService.setUserFromToken(false);
    $rootScope.User = {
        Categories: ['Museums', 'Restaurants']
    };
    $rootScope.currentPoi = null;
    $rootScope.noReviews = false;
    $("#goUpArrow").hide();

    //check if login button was clicked
    $scope.onClickLogin = function() {
        $rootScope.loginClicked = !$rootScope.loginClicked;
    }
    //check if other parts of the windows that is not login was pressed (to hide the login window)
    $scope.onClickOtherForLogin = function() {
        $rootScope.loginClicked = false;
    }

    //login handle function
    $scope.login = function() {
        loginService.login();
    }
    $scope.setUserFromToken = function() {
        loginService.setUserFromToken();
    }

    //logout function
    $scope.logout = function() {
        loginService.logout();
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
      
      //handle pois
    $rootScope.getPoi = function(poiName) {
        $http.get(serverUrl +"poi/getSite/" + poiName)
        .then(function(response){
            $rootScope.currentPoi = response.data.Points_of_interests[0];
            $http.get(serverUrl +"poi/getSiteReviews/" + poiName)
            .then(function(response){
                $rootScope.noReviews = false;
                $rootScope.currentPoi.Reviews = response.data.reviews;
             },function(response){
                 $rootScope.noReviews=true;
                 $rootScope.currentPoi.Reviews = [];
            })
         },function(response){
             $rootScope.currentPoi = null;
        })     
    }
     

}]);


$('#poi-Modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var modal = $(this)
  })