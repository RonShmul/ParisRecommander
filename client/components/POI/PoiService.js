angular.module("citiesApp")
    .service('PoiService', ['$rootScope', 'setToken', '$http', '$location', 'localStorageModel', function($rootScope, setToken, $http, $location, localStorageModel) {
        let serverUrl = 'http://localhost:3000/';
        
        let self = this;
        
        /*variables*/
        self.allPois = null;
        self.activePoi = null;
        self.explorePois = null;
        self.userPopularPois = null;
        self.userLastSavedPois = null;
        self.userFavoritesList = null;
        $rootScope.favoritesCount = 0;
         //set selected poi in modal
        self.getPoi = function(poiName) {
            return $http.get(serverUrl +"poi/getSite/" + poiName)
                .then(function(response){
                    self.activePoi = response.data.Points_of_interests;
                    $rootScope.$broadcast('poi:activepoi',self.activePoi);
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
            var tokenData = localStorageModel.get('token');
            if(!tokenData) {
                self.userPopularPois = [];
                return [];
            }
            var categories = localStorageModel.get("userCategories");
            setToken.set(tokenData);
            self.userPopularPois = [];

            return new Promise(function(resolve, reject) {
                var index = Math.floor(Math.random() * categories.length)
                var randomCat1 = categories[index];
                categories.splice(index, 1);
                var index = Math.floor(Math.random() * categories.length)
                var randomCat2 = categories[index];
                resolve([randomCat1, randomCat2]);
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
            }).catch(function(response){
                reject(self.userPopularPois);
            })
        }

        //get 2 last points saved by logged in user
        self.getLastSaved = function() {
            var tokenData = localStorageModel.get('token');
            if(!tokenData) {
                self.userLastSavedPois = [];
                return [];
            }
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

        //get logged in user's favorites list from local storage
        self.getFavoritesList = function() {
            if(self.userFavoritesList == null || self.userFavoritesList.length == 0) {
                self.userFavoritesList = localStorageModel.get("favoritesPois") ? localStorageModel.get("favoritesPois") : [];
                return self.userFavoritesList;
            } else {
                return self.userFavoritesList;
            }
            
        }

        //update favorite list with active poi
        self.updateFavorites = function(toAdd) {
            self.getFavoritesList();
            if(toAdd) {
                self.userFavoritesList.push(self.activePoi);
                $rootScope.favoritesCount++;
            } else {
                $rootScope.favoritesCount--;
                var i = 0;
                for(i = 0; i < self.userFavoritesList.length; i++) {
                    if(self.userFavoritesList[i].PointName == self.activePoi.PointName) {
                        break;
                    }
                }
                self.userFavoritesList.splice(i, 1);
            }
            localStorageModel.update("favoritesPois", self.userFavoritesList);
        }
        
        //remove from favorites list with a given point name
        self.removeFromFav = function(poiToRmove) {
            self.getFavoritesList();
            var i = 0;
            for(i = 0; i < self.userFavoritesList.length; i++) {
                if(self.userFavoritesList[i].PointName == poiToRmove) {
                    break;
                }
            }
            $rootScope.favoritesCount--;
            self.userFavoritesList.splice(i, 1);
            localStorageModel.update("favoritesPois", self.userFavoritesList);
        }

        //check if the active poi is in the favrites list
        self.checkPoiInFavorites = function() {
            var favoritesPois = self.getFavoritesList();
            for(var i = 0; i < favoritesPois.length; i++) {
                if(favoritesPois[i].PointName == self.activePoi.PointName) {
                    return true;
                }
            }
            return false;
        }

        //save favorite list to DB
        self.saveFavoriteList = function() {
            self.getFavoritesList();
            var tokenData = localStorageModel.get('token');
            setToken.set(tokenData);
            var favPoints = {};
            favPoints.Points = [];
            for(var i = 0; i < self.userFavoritesList.length; i++) {
                favPoints.Points.push(self.userFavoritesList[i].PointName);
            }
            return $http.post(serverUrl +"users/auth/SaveFavoritesList", JSON.stringify(favPoints))
                .then(function(response){
                    return true;
                }, function(response) {
                    return false;
                });
        }
        $rootScope.favoritesCount = self.getFavoritesList().length;
    }]);
