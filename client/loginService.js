angular.module("citiesApp")
    .service('loginService', ['PoiService', '$rootScope','setToken', '$http', '$location', 'localStorageModel', function(PoiService, $rootScope, setToken, $http, $location, localStorageModel) {
        
        let serverUrl = 'http://localhost:3000/';

        var self=this;

        /* variables */
        self.isLoggedIn = false;
        self.User = {
            Username: "Guest",
        }

        //set Username in User from token
        self.setUserFromToken = function() {
            var dataVal = localStorageModel.get('token');
            var categories = localStorageModel.get('userCategories');
            var token = self.jwtDecode(dataVal); //todo if expired
            if(dataVal) {
                self.isLoggedIn = true;
                self.User.Username = token.payload.Username;
                self.User.Categories = categories;
                PoiService.userFavoritesList = localStorageModel.get('favoritesPois');

            } else {
                self.isLoggedIn = false;
                var user = {
                    Username: "Guest",
                }
                self.User = user;
            }
        }

        //login function save the token in local storage and header requests and set isLoggedIn to true
        self.login = function(User) {
            self.User = User;
            return $http.post(serverUrl +"users/login", JSON.stringify(self.User))
                .then(function(response){
                    setToken.set(response.data.token);
                    self.isLoggedIn = true;
                    localStorageModel.set('token',response.data.token);
                    $location.path( "/" );
                    return "SUCCESS";
                },function(response){
                    return response.data.message;
                }).then(function(message) {
                    return $http.post(serverUrl +"users/auth/getUserCategories")
                        .then(function(response){
                            var categories = [];
                            for(var i = 0; i < response.data.Categories.length; i++) {
                                categories.push(response.data.Categories[i].Category);
                            } 
                            localStorageModel.set('userCategories', categories);
                            return message;
                        }).then(function(message) {
                            return $http.post(serverUrl +"users/auth/FavoritePointsOfInterest")
                                .then(function(response){
                                    localStorageModel.set('favoritesPois', response.data.FavoriteList);
                                    self.setUserFromToken();
                                    $rootScope.$broadcast('user:login',self.isLoggedIn);
                                    return message;
                                }, function(response) {
                                    localStorageModel.set('favoritesPois', response.data.FavoriteList);
                                    self.setUserFromToken();
                                    $rootScope.$broadcast('user:login',self.isLoggedIn);
                                    return message;
                                });
                        });
                });
        }

        //get token and extract the payload and header from the payload
        self.jwtDecode = function(t) {
            if(!t) {
                return null;
            }
            let token = {};
            token.raw = t;
            token.header = JSON.parse(window.atob(t.split('.')[0]));
            token.payload = JSON.parse(window.atob(t.split('.')[1]));
            return (token)
        }
        
        //logout function will delete the token from local storage, set isLoggedIn to false and set the user to guest
        self.logout = function() {
            localStorageModel.deleteStorage();

            var user = {
                Username: "Guest",
            }
            self.isLoggedIn = false;
            self.User = user
            $rootScope.$broadcast('user:login',self.isLoggedIn);
            $location.path( "/" );
        } 
    }]);

    