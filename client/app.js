let app = angular.module('citiesApp', ["ngRoute"]);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {


    $locationProvider.hashPrefix('');

    let serverUrl = 'http://localhost:3000/';
    $routeProvider.when('/', {
        template: '<h1>This is the default route</h1>'
    })
        .when('/about', {
            templateUrl: 'components/About/about.html',
            controller : 'aboutController as abtCtrl'
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
        .otherwise({ redirectTo: '/' });
}]);