angular.module('citiesApp')
 .controller('poiCtrl', [ '$http','$scope', 'poi', 'PoiService', function($http, $scope, poi, PoiService) {
    let serverUrl = 'http://localhost:3000/';
    $scope.allPois = poi;
    PoiService.allPois = poi;
    
    $("#goUpArrow").hide();
    
    $http.get(serverUrl +"poi/getCategories")
    .then(function(response){
        $scope.categories = response.data.Categories;
    },function(response){
        $scope.categories = "Something went wrong";
    })
    $scope.sites = poi;
   
}]);

