angular.module('citiesApp')
    .controller('regCtrl', ['localStorageModel', 'loginService', '$http','$scope', '$rootScope', 'setToken', '$location',
    function(localStorageModel, loginService, $http, $scope, $rootScope, setToken, $location) {
        let serverUrl = 'http://localhost:3000/';
        self = this;
        
        $scope.numOfCategories=0;
        $scope.UserInput = {
            Categories: [],
            Country: ""
        };
        /**
         * All the preperation
         */

        //gets the categories from the server
        getCategories=function(){  //Todo : put this function in service for reuse
            $http.get(serverUrl +"poi/getCategories")
            .then(function(response){
                $scope.categories = response.data.Categories;
            },function(response){
                $scope.categories = "Something went wrong";
            })
        }
        getCategories();

        //checks how many categories were chosen
        $scope.sumCategories=function(checked, category){
            if(checked){
                $scope.numOfCategories++;
                $scope.UserInput.Categories.push(category);        
            }            
            else{
                $scope.numOfCategories--;
                var inx = $scope.UserInput.Categories.indexOf(category);
                $scope.UserInput.Categories.splice(indx, 1);
            }
        }

        //gets the countries from an xml file
        self.getCountries = function(){
            var req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                var result =[]
                if(this.readyState == 4 && this.status == 200){
                    var xml = this.responseXML;
                    var xmlcountries = xml.getElementsByTagName("Country");
                    for(var i=0; i<xmlcountries.length; i++ ){
                        var country = {
                            "id": xmlcountries[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue.toString(),
                            "Name": xmlcountries[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString()
                        }
                        result.push(country);
                    }
                    $scope.countries = result;
                }
            }           
            req.open("GET","../../countries/countries.xml", true);
            req.send();
       }
       
       self.getCountries();

        /**
         * The submit
         */

        $scope.submit = function(invalid) {
            $("#goUpArrow").hide();
<<<<<<< HEAD
            $scope.valid=false;
            
            if(!invalid && $scope.numOfCategories>1 && $scope.UserInput.Country !=="") {
=======
            var isValid = true;
            $scope.valid=false;
           // var x = document.getElementById("Username"); //todo: checks only empty fields- how to check other validations
            //if(!x.checkValidity()){
            //    isValid = false;
            //}            
            
            if(!invalid && $scope.numOfCategories>1) { //Todo= change for country
>>>>>>> 7d14e8b0ff4f959e20da3220869dc00b294a1ebd
                $http.post(serverUrl +"users/register", JSON.stringify($scope.UserInput))
                .then(function(response){
                    setToken.set(response.data.token);
                    localStorageModel.set('token',response.data.token);
                    localStorageModel.set('userCategories',$scope.UserInput.Categories);
                    loginService.User = $scope.UserInput;
                    loginService.isLoggedIn = true;
                    $location.path( "/" );
                    $rootScope.$broadcast('user:login',loginService.isLoggedIn);
                    $scope.UserInput = {};
                },function(response){
                    alert(response.data.message);
                });
            } else {
                $scope.valid = true;
            }
        }
}]);
