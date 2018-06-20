angular.module('citiesApp')
 .controller('myCtrl', ['$http','$scope', '$rootScope', function($http, $scope, $rootScope) {
     $rootScope.isLoggedIn = false;
    $rootScope.CurrentUsername = "Guest";
    $rootScope.defaultUser = {
        Username: "Guest"
    };
    $rootScope.User = {
        Categories: ['Museums', 'Restaurants']
    };
}]);
