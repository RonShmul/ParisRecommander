angular.module('citiesApp')
 .controller('poiCtrl', ['$http','$scope', 'poi', function($http, $scope, poi) {
    let serverUrl = 'http://localhost:3000/';
    $("#goUpArrow").hide();
    $http.get(serverUrl +"poi/getCategories")
    .then(function(response){
        $scope.categories = response.data.Categories;
    },function(response){
        $scope.categories = "Something went wrong";
    })
    $scope.sites = poi;
   
}]);

