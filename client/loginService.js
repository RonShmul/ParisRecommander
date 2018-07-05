angular.module("citiesApp")
    .service('loginService', ['setToken', '$http', '$location', 'localStorageModel', '$rootScope', function(setToken, $http, $location, localStorageModel, $rootScope) {
        
        let serverUrl = 'http://localhost:3000/';

        var self=this;
        //set user from token
        self.setUserFromToken = function(isLogout) {
            var dataVal = localStorageModel.get('token');
            var token = self.jwtDecode(dataVal);
            if(dataVal) {
                
                    $rootScope.isLoggedIn = true;
                    $rootScope.CurrentUsername = token.payload.Username;
                    $location.path( "/" );
            } else {
                    $rootScope.isLoggedIn = false;
                    $rootScope.CurrentUsername = "Guest";
                    if(isLogout) {
                        $location.path("/");
                    } else {
                        $location.path( "/login" );
                    }
            }
        }

        //login function
        self.login = function() {
            isValid = true;
            if(isValid) {
                $http.post(serverUrl +"users/login", JSON.stringify($rootScope.User))
                .then(function(response){
                    $rootScope.loginClicked = false;
                    setToken.set(response.data.token);
                    $rootScope.CurrentUsername = $rootScope.User.Username;
                    $rootScope.isLoggedIn = true;
                    localStorageModel.set('token',response.data.token);
                    $location.path( "/" );
                },function(response){
                    alert(response.data.message);
                });
            } else {
                alert("Absolutely not..");
            }
        }
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

        self.logout = function() {
            localStorageModel.deleteToken();
            self.setUserFromToken(true);
        } 
    }]);

    