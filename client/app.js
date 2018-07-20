let app = angular.module('citiesApp', ['ngRoute','LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');

    let serverUrl = 'http://localhost:3000/';
    $routeProvider.when('/', {
        templateUrl: 'components/Home/home.html',
        controller : 'homeController',
        resolve: {
            exUserPois: function(localStorageModel, PoiService) {
                if(localStorageModel.get('token')) {
                    return PoiService.getUserExplorePois().then(function(pois) {
                        return pois;
                    });
                }
            },
            lastSavedPois: function(localStorageModel, PoiService) {
                if(localStorageModel.get('token')) {
                    return PoiService.getLastSaved().then(function(pois) {
                        return pois;
                    });
                }
            },
            exPois: function(PoiService) {
                return PoiService.getRandomPopularPois().then(function(pois) {
                    return pois;
                });
            }
        }
        })
        .when('/about', {
            templateUrl: 'components/About/about.html',
            controller : 'aboutController'
        })
        .when('/poi', {
            templateUrl: 'components/POI/poi.html',
            controller : 'poiCtrl',
            resolve: {
                poi: function($http){
                        return $http.get(serverUrl +"poi/getAllSites")
                        .then(function(response){
                        return response.data.Points_of_interests;
                        },function(response){
                            self.content = "Something went wrong";
                        })
                }
        }
        })
        .when('/register',{
            templateUrl:'components/Home/register.html',
            controller: 'regCtrl as regCtrl'
        })
        .when('/login',{
            templateUrl:'login.html',
        })
        .when('/favorites',{
            templateUrl:'components/Favorites/favorites.html',
            controller: 'FavCtrl'
        })
        .otherwise({ redirectTo: '/' });
}]);


app.service('setToken',['$http', function($http){
    let token = ""
    this.set = function(t){
        token = t;
        $http.defaults.headers.common['x-access-token'] = t;
    }
}]);
