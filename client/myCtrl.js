angular.module('citiesApp')
 .controller('myCtrl', ['PoiService', 'loginService', '$window', '$location','setToken', '$http','$scope', '$rootScope','localStorageModel', function(PoiService, loginService, $window, $location,setToken, $http, $scope, $rootScope,localStorageModel) {
    /*variables*/
    let serverUrl = 'http://localhost:3000/';
    var PoiService = PoiService;
    loginService.setUserFromToken();
    $scope.isLoggedIn = loginService.isLoggedIn;
    $scope.User = loginService.User;
    $scope.UserInput = {}
    $scope.activePoi = null;
    $scope.hasReviews = false;
    $scope.userRecover={};
    $scope.pass=false;
    $scope.err=false;
    $("#goUpArrow").hide();


    
    $scope.$on('user:login', function(event,data) {
        $scope.isLoggedIn = data;
        loginService.setUserFromToken();
        $scope.User = loginService.User;
        if(!data) {
            PoiService.userFavoritesList = [];
        }
    });

    

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
                $location.path( "/" );
                self.isLoggedIn = true;
            }
        })
        $scope.showLogin = false;
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
      var mymap;
    //set selected poiin modal
    $scope.getPoi = function(poiName) {
        var poi = PoiService.getPoi(poiName);
        poi.then(function(poi) {
            $scope.activePoi = poi;
            $scope.hasReviews = (poi.Reviews.length != 0);
            if(mymap != undefined)
             {
                mymap.remove();
             }
             mymap= new L.map('mapid').setView(new L.LatLng(poi.y, poi.x), 15);
            new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1Ijoic2l2YW5ucmVqZSIsImEiOiJjamswMWZncTAwMjBzM3FvejJ1NjN1aXlrIn0.aBekR9hcOQwDvN3l2wqUZw'
            }).addTo(mymap);
            var marker = L.marker([	poi.y, poi.x]).addTo(mymap);
                marker.bindPopup("<b>"+poi.PointName +"!</b><br>").openPopup();
        })
    }

    //return the user's password if the security answers are correct
    $scope.showPassword= function(){
        $http.post(serverUrl +"users/restorePassword", JSON.stringify($scope.userRecover))
        .then(function(response){
            $scope.pass=true;
            $scope.err=false;
            $scope.passwd=response.data.Password;            
        },function(response){
            $scope.pass=false;
            $scope.err=true;
            return response.data.message;
        }
     )    
 };
}]);

$('#poi-Modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var modal = $(this)
  })

  $('#recoverPasswd').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var modal = $(this)
  });