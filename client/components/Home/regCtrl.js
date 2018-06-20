angular.module('citiesApp')
    .controller('regCtrl', ['$http','$scope', '$rootScope', 'setToken', '$location', 
    function($http, $scope, $rootScope, setToken, $location) {
        let serverUrl = 'http://localhost:3000/';
        $scope.submit = function(isValid) {

            isValid = true;
            if(isValid) {
                $http.post(serverUrl +"users/register", JSON.stringify($rootScope.User))
                .then(function(response){
                    setToken.set(response.data.token);
                    $rootScope.CurrentUsername = $rootScope.User.Username;
                    $rootScope.isLoggedIn = true;
                    $location.path( "/" );
                },function(response){
                    $scope.error = "Something went wrong";
                });
            } else {
                alert("Absolutely not..");
            }
        }
}]);