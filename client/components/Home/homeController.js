angular.module('citiesApp')
 .controller('homeController', ['$http','$scope', function($http, $scope, poi) {
 
    let serverUrl = 'http://localhost:3000/';

    $http.get(serverUrl +"poi/getAllSites")
        .then(function(response){
            $scope.sites = response.data.Points_of_interests;
            var sitesArray = [];
            for(var i = 0; i < $scope.sites.length; i++) {
                if($scope.sites[i]['Rate'] >= 4) {
                    sitesArray.push($scope.sites[i]);
                }
            }
            var index = Math.floor(Math.random() * sitesArray.length)
            var randomSite1 = sitesArray[index];
            sitesArray.splice(index, 1);
            var index = Math.floor(Math.random() * sitesArray.length)
            var randomSite2 = sitesArray[index];
            sitesArray.splice(index, 1);
            var index = Math.floor(Math.random() * sitesArray.length)
            var randomSite3 = sitesArray[index];
            sitesArray.splice(index, 1);
            $scope.sites = [randomSite1, randomSite2, randomSite3];

        },function(response){
            $scope.sites = "Something went wrong";
        })
 }]);

  
  