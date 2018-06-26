angular.module("citiesApp")
    .service('localStorageModel', ['localStorageService', function(localStorageService) {

        var self=this;

        self.set = function (key, value) {
            var dataVal = localStorageService.get(key);
            console.log(dataVal)
            if (!dataVal)
            if (localStorageService.set(key, value)) {
                console.log("data added")
            }
            else
                console.log('failed to add the data');
        }



        self.get= function (key)
        {
           return  localStorageService.get(key)
        }

        self.update = function (key,value)
        {
            localStorageService.remove(key);
            localStorageService.set(key,value);
        }
        self.deleteLocalStorage = function ()
        {
            localStorageService.remove("dbpois");
            localStorageService.remove("localdeletepois");
            localStorageService.remove("localpoiarray");
            localStorageService.remove("token");

        }
        


    }]);