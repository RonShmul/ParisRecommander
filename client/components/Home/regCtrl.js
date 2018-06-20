angular.module('citiesApp')
    .controller('regCtrl', ['$http','$scope', '$rootScope', 'setToken', function($http,$rootScope, $scope, setToken) {
        let serverUrl = 'http://localhost:3000/';
        $scope.submit = function() {
            $http.post(serverUrl +"users/register", JSON.stringify($rootScope.User))
        .then(function(response){
            setToken.set(response.data.token);
        },function(response){
            $scope.error = "Something went wrong";
        })
    }
}]);
