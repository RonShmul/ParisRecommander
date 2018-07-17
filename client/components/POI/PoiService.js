angular.module("citiesApp")
    .service('PoiService', ['setToken', '$http', '$location', 'localStorageModel', function(setToken, $http, $location, localStorageModel) {
        let serverUrl = 'http://localhost:3000/';
        
        let self = this;
        
        /*variables*/
        self.allPois = null;
        self.activePoi = null;
        self.explorePois = null;
        self.userPopularPois = null;
        self.userLastSavedPois = null;

         //set selected poi in modal
        self.getPoi = function(poiName) {
            return $http.get(serverUrl +"poi/getSite/" + poiName)
                .then(function(response){
                    self.activePoi = response.data.Points_of_interests;
                    return  self.activePoi;
                },function(response){
                    self.activePoi = null;
                    return  self.activePoi;
                })     
        }

        //get all points of interest in the DB
        self.getAllPois = function() {
            if(self.allPois == null || self.allPois.length == 0) {
                return $http.get(serverUrl +"poi/getAllSites")
                .then(function(response){
                    self.allPois = response.data.Points_of_interests;
                    return self.allPois;
                })
            } else {
                return Promise.resolve(self.allPois);
            }
        }

        //get 3 random popular points of interests
        self.getRandomPopularPois = function() {
            return self.getAllPois().then(function(allPois) {
                var sitesArray = [];
                for(var i = 0; i < allPois.length; i++) {
                    if(allPois[i]['Rate'] >= 4) {
                        sitesArray.push(allPois[i]);
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
                self.explorePois = [randomSite1, randomSite2, randomSite3];
                return self.explorePois;
            });
        }

        //get 2 random popular points from logged in user's category
        self.getUserExplorePois = function() {
            var categories = [];
            var tokenData = localStorageModel.get('token');
            setToken.set(tokenData);
            return $http.post(serverUrl +"users/auth/getUserCategories")
            .then(function(response){
                categories = response.data.Categories;
                return categories;
            }).then(function(categories) {
                self.userPopularPois = [];

                var index = Math.floor(Math.random() * categories.length)
                var randomCat1 = categories[index].Category;
                categories.splice(index, 1);
                var index = Math.floor(Math.random() * categories.length)
                var randomCat2 = categories[index].Category;
                return [randomCat1, randomCat2];
            }).then(function(randomCategories) {
                return $http.get(serverUrl +"poi/getHighestPointByCategory/" + randomCategories[0])
                .then(function(response){
                    self.userPopularPois.push(response.data.Points_of_interests[0]);
                    return $http.get(serverUrl +"poi/getHighestPointByCategory/" + randomCategories[1])
                    .then(function(response){
                        self.userPopularPois.push(response.data.Points_of_interests[0]);
                        return self.userPopularPois;
                    },function(response){
                        return self.userPopularPois;
                    })
                },function(response){
                    return self.userPopularPois;
                });
            },function(response){
                return self.userPopularPois;
            })
        }

        //get 2 last points saved by logged in user
        self.getLastSaved = function() {
            var tokenData = localStorageModel.get('token');
            setToken.set(tokenData);
            return $http.post(serverUrl +"users/auth/LastSaved")
                .then(function(response){
                    self.userLastSavedPois = [response.data.LastUserPointsOfInterests[0], response.data.LastUserPointsOfInterests[1]];
                    return self.userLastSavedPois;
                }, function(response) {
                    self.userLastSavedPois = [];
                    return self.userLastSavedPois;
                });
        }
    }]);



    // $http.get(serverUrl +"poi/getAllSites")
    //     .then(function(response){
    //         $scope.sites = response.data.Points_of_interests;
    //         var sitesArray = [];
    //         for(var i = 0; i < $scope.sites.length; i++) {
    //             if($scope.sites[i]['Rate'] >= 4) {
    //                 sitesArray.push($scope.sites[i]);
    //             }
    //         }
    //         var index = Math.floor(Math.random() * sitesArray.length)
    //         var randomSite1 = sitesArray[index];
    //         sitesArray.splice(index, 1);
    //         var index = Math.floor(Math.random() * sitesArray.length)
    //         var randomSite2 = sitesArray[index];
    //         sitesArray.splice(index, 1);
    //         var index = Math.floor(Math.random() * sitesArray.length)
    //         var randomSite3 = sitesArray[index];
    //         sitesArray.splice(index, 1);
    //         $scope.sites = [randomSite1, randomSite2, randomSite3];

    //     },function(response){
    //         $scope.sites = "Something went wrong";
    //     })

    //     var tokenData = localStorageModel.get('token');
    //        var token = loginService.jwtDecode(tokenData);
    //        setToken.set(tokenData);
    //        $http.post(serverUrl +"users/auth/getUserCategories")
    //     .then(function(response){
    //         var categories = response.data.Categories;
            
    //         $scope.points = [];

    //         var index = Math.floor(Math.random() * categories.length)
    //         var randomCat1 = categories[index].Category;
    //         categories.splice(index, 1);
    //         var index = Math.floor(Math.random() * categories.length)
    //         var randomCat2 = categories[index].Category;
    //         categories.splice(index, 1);

    //         $http.get(serverUrl +"poi/getHighestPointByCategory/" + randomCat1)
    //         .then(function(response){
    //             $scope.points.push(response.data.Points_of_interests[0]);
    //             $http.get(serverUrl +"poi/getHighestPointByCategory/" + randomCat2)
    //             .then(function(response){
    //                 $scope.points.push(response.data.Points_of_interests[0]);
    //             },function(response){
    //                 $scope.points = "Something went wrong";
    //             })
    //         },function(response){
    //             $scope.points = "Something went wrong";
    //         })
            
    //     },function(response){
    //         $scope.points = "Something went wrong";
    //     })

    //     var tokenData = localStorageModel.get('token');
    //        setToken.set(tokenData);
    //         $http.post(serverUrl +"users/auth/LastSaved")
    //         .then(function(response){
    //             $scope.lastSaved = [response.data.LastUserPointsOfInterests[0], response.data.LastUserPointsOfInterests[1]];
    //         }, function(response) {
    //             $scope.lastSaved = [response.message];
    //         });