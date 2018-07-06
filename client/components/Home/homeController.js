angular.module('citiesApp')
 .controller('homeController', ['loginService', 'setToken', 'localStorageModel', '$http','$scope', function(loginService, setToken, localStorageModel, $http, $scope, poi) {
    $("#goUpArrow").hide();

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

        var tokenData = localStorageModel.get('token');
           var token = loginService.jwtDecode(tokenData);
           setToken.set(tokenData);
           $http.post(serverUrl +"users/auth/getUserCategories")
        .then(function(response){
            var categories = response.data.Categories;
            
            $scope.points = [];

            var index = Math.floor(Math.random() * categories.length)
            var randomCat1 = categories[index].Category;
            categories.splice(index, 1);
            var index = Math.floor(Math.random() * categories.length)
            var randomCat2 = categories[index].Category;
            categories.splice(index, 1);

            $http.get(serverUrl +"poi/getHighestPointByCategory/" + randomCat1)
            .then(function(response){
                $scope.points.push(response.data.Points_of_interests[0]);
                $http.get(serverUrl +"poi/getHighestPointByCategory/" + randomCat2)
                .then(function(response){
                    $scope.points.push(response.data.Points_of_interests[0]);
                },function(response){
                    $scope.points = "Something went wrong";
                })
            },function(response){
                $scope.points = "Something went wrong";
            })
            
        },function(response){
            $scope.points = "Something went wrong";
        })

        var tokenData = localStorageModel.get('token');
           setToken.set(tokenData);
            $http.post(serverUrl +"users/auth/LastSaved")
            .then(function(response){
                $scope.lastSaved = [response.data.LastUserPointsOfInterests[0], response.data.LastUserPointsOfInterests[1]];
            }, function(response) {
                $scope.lastSaved = [response.message];
            });
 }]);