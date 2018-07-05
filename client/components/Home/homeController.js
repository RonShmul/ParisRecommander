angular.module('citiesApp')
 .controller('homeController', ['homeService', '$http','$scope', function(homeService, $http, $scope, poi) {
    $("#goUpArrow").hide();
    $scope.sites = homeService.getExplorePois();
    $scope.twoPopularPois = homeService.get2PopularPois();
    $scope.twoLastPois = homeService.get2LastPois();    
 }]);

  
  