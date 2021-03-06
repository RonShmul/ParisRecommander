angular.module('citiesApp')
 .controller('homeController', ['exPois', 'lastSavedPois', 'exUserPois','PoiService', 'loginService', 'setToken', 'localStorageModel', '$http','$scope', function(exPois, lastSavedPois, exUserPois, PoiService, loginService, setToken, localStorageModel, $http, $scope, poi) {
    $("#goUpArrow").hide();
    /*variables*/
    $scope.explorePois = exPois;
    $scope.exploreUserPois = exUserPois;
    $scope.userLastPois = lastSavedPois;
    loginService.setUserFromToken();
    $scope.isLoggedIn = loginService.isLoggedIn;
    $scope.noLast = $scope.userLastPois ?  $scope.userLastPois.length== 0: false;
    //on  login
    $scope.$on('user:login', function(event,data) {
        $scope.isLoggedIn = data;
        loginService.setUserFromToken();
        if(data) {
            PoiService.getUserExplorePois().then(function(RandPois) {
                $scope.exploreUserPois = RandPois;
                $scope.$apply();
            });
            PoiService.getLastSaved().then(function(pois) {
                $scope.userLastPois = pois;
                $scope.noLast = $scope.userLastPois.length?  $scope.userLastPois.length== 0: false;
                $scope.$apply();
            });
        }
    });
 }]);