angular.module('citiesApp')
 .controller('regCtrl', ['$http','$scope', function($http,$scope) {
    
    let serverUrl = 'http://localhost:3000/';
    
    $http.post(serverUrl +"users/register", user)
    .then(function(respons){
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
