angular.module("citiesApp")
    .service('homeService', ['loginService', 'setToken', '$http', '$location', 'localStorageModel', '$rootScope', function(loginService, setToken, $http, $location, localStorageModel, $rootScope) {
        
        let serverUrl = 'http://localhost:3000/';

        var self=this;
        //get 3 random pois
        self.getExplorePois = function() {
            let sites = [];
            $http.get(serverUrl +"poi/getAllSites")
        .then(function(response){
            sites = response.data.Points_of_interests;
            var sitesArray = [];
            for(var i = 0; i < sites.length; i++) {
                if(sites[i]['Rate'] >= 4) {
                    sitesArray.push(sites[i]);
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
            sites = [randomSite1, randomSite2, randomSite3];

        },function(response){
            sites = "Something went wrong";
        })
        return sites;
        }
        
        //get 2 popular poi's by user's choise
        self.get2PopularPois = function() {
           var tokenData = localStorageModel.get('token');
           setToken.set(tokenData);
           var token = loginService.jwtDecode(tokenData);
           $http.get(serverUrl +"users/auth/getUserCategories")
        .then(function(response){
            let categories = response.data.Categories;
            
            let points = [];

            var index = Math.floor(Math.random() * categories.length)
            var randomCat1 = categories[index];
            categories.splice(index, 1);
            var index = Math.floor(Math.random() * categories.length)
            var randomCat2 = categories[index];
            categories.splice(index, 1);

            $http.get(serverUrl +"poi/getHighestPointByCategory/" + randomCat1)
            .then(function(response){
                points.push(response.data.Points_of_interests[0]);
                $http.get(serverUrl +"poi/getHighestPointByCategory/" + randomCat2)
                .then(function(response){
                    points.push(response.data.Points_of_interests[0]);
                    return points;
                },function(response){
                    return "Something went wrong";
                })
            },function(response){
                return "Something went wrong";
            })
            
        },function(response){
            return "Something went wrong";
        })
        }
        self.get2LastPois = function() {
            var tokenData = localStorageModel.get('token');
           setToken.set(tokenData);
            $http.get(serverUrl +"users/auth/LastSaved")
            .then(function(response){
                let arr = [response.LastUserPointsOfInterests[0], response.LastUserPointsOfInterests[1]];
                return arr;
            }, function(response) {
                return response.message;
            })
        }
        
    }]);

    