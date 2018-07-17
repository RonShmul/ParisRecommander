angular.module('citiesApp')
 .controller('myCtrl', ['PoiService', 'loginService', '$window', '$location','setToken', '$http','$scope', '$rootScope','localStorageModel', function(PoiService, loginService, $window, $location,setToken, $http, $scope, $rootScope,localStorageModel) {
    /*variables*/
    let serverUrl = 'http://localhost:3000/';

    loginService.setUserFromToken();
    $scope.isLoggedIn = loginService.isLoggedIn;
    $scope.User = loginService.User;
    $scope.UserInput = {}
    $scope.activePoi = null;
    $scope.hasReviews = false;
    $rootScope.isInFav = false;

    $("#goUpArrow").hide();

    //check if login button was clicked
    $scope.onClickLogin = function() {
        $scope.showLogin = !$scope.showLogin;
    }
    //check if other parts of the windows that is not login was pressed (to hide the login window)
    $scope.onClickOtherForLogin = function() {
        $scope.showLogin = false;
    }

    //login handle function
    $scope.login = function() {
        loginService.login($scope.UserInput).then(function(message) {
            if(message !== "SUCCESS") {
                alert(message);
                self.isLoggedIn = false;
            } else {
                self.isLoggedIn = true;
            }
        })
        $scope.showLogin = false;
    }

    $scope.setUserFromToken = function() {
        loginService.setUserFromToken();
    }

    //logout function
    $scope.logout = function() {
        loginService.logout();
        $scope.isLoggedIn = loginService.isLoggedIn;
        $scope.User = loginService.User;
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
      
    //set selected poiin modal
    $scope.getPoi = function(poiName) {
        var poi = PoiService.getPoi(poiName);
        poi.then(function(poi) {
            $scope.activePoi = poi;
            $scope.hasReviews = (poi.Reviews.length != 0);
        })
    }
     
    $scope.$on('user:login', function(event,data) {
        $scope.isLoggedIn = data;
        loginService.setUserFromToken();
        $scope.User = loginService.User;
        });

    //check if the current poi is in the logged in user's favorites
    $scope.checkFavorites = function() {
        
    }

    //when add/remove to/from favorites button (heart) is clicked
    $scope.pressFavorite = function() {

    }

}]);

$('#poi-Modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var modal = $(this)
  })