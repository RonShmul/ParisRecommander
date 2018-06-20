angular.module('citiesApp')
 .controller('myCtrl', ['$http','$scope', '$rootScope', function($http, $scope, $rootScope) {
    $rootScope.defaultUser = {
        Username: "Guest",
        Categories: ['Museums', 'Restaurants']
    };
    $rootScope.User = $rootScope.defaultUser;
}]);
