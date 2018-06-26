angular.module('citiesApp')
 .controller('myCtrl', ['$window', '$location','setToken', '$http','$scope', '$rootScope','localStorageModel', function($window, $location,setToken, $http, $scope, $rootScope,localStorageModel) {
    $rootScope.isLoggedIn = false;
    let serverUrl = 'http://localhost:3000/';
    $rootScope.CurrentUsername = "Guest";
    $rootScope.defaultUser = {
        Username: "Guest"
    };
    $rootScope.User = {
        Categories: ['Museums', 'Restaurants']
    };
    $scope.loginClicked = false;
    $scope.onClickLogin = function() {
        $scope.loginClicked = !$scope.loginClicked;
    }
    $scope.onClickOtherForLogin = function() {
        $scope.loginClicked = false;
    }
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
}]);
