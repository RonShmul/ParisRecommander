angular.module('citiesApp')
    .controller('myCtrl', [function () {


        self = this;

        self.hello = true;

        self.flipHello = function () {
            self.hello = !self.hello
        }

        self.checkNumber = function (number) {
            if (number % 2 == 0)
                return true
            else
                return false
        }

    }]);
