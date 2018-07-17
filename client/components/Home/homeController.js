angular.module('citiesApp')
 .controller('homeController', ['PoiService', 'loginService', 'setToken', 'localStorageModel', '$http','$scope', function(PoiService, loginService, setToken, localStorageModel, $http, $scope, poi) {
    $("#goUpArrow").hide();
    /*variables*/
    // $scope.explorePois = [];
    // $scope.exploreUserPois = [];
    // $scope.userLastPois = [];
    loginService.setUserFromToken();
    $scope.isLoggedIn = loginService.isLoggedIn;
    $scope.$on('user:login', function(event,data) {
        $scope.isLoggedIn = data;
        loginService.setUserFromToken();
        });
        if(localStorageModel.get('token')) {
            PoiService.getUserExplorePois().then(function(pois) {
                $scope.exploreUserPois = pois;
            });
            PoiService.getLastSaved().then(function(pois) {
                $scope.userLastPois = pois;
            });
        }
    PoiService.getRandomPopularPois().then(function(pois) {
        $scope.explorePois = pois;
    })


 }]);