angular.module('citiesApp')
 .controller('myCtrl', ['setToken', '$http','$scope', '$rootScope', function(setToken, $http, $scope, $rootScope) {
    $rootScope.isLoggedIn = false;
    let serverUrl = 'http://localhost:3000/';
    $rootScope.CurrentUsername = "Guest";
    $rootScope.defaultUser = {
        Username: "Guest"
    };
    $rootScope.User = {
        Categories: ['Museums', 'Restaurants']
    };

    $scope.login = function() {
        isValid = true;
        if(isValid) {
            $http.post(serverUrl +"users/login", JSON.stringify($rootScope.User))
            .then(function(response){
                setToken.set(response.data.token);
                $rootScope.CurrentUsername = $rootScope.User.Username;
                $rootScope.isLoggedIn = true;
                $location.path( "/" );
            },function(response){
                alert(response.data.message);
            });
        } else {
            alert("Absolutely not..");
        }
    }
}]);

$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
  })