angular.module('citiesApp')
 .controller('poiCtrl', ['$http','$scope', 'poi', function($http, $scope, poi) {
 
    let serverUrl = 'http://localhost:3000/';
    $scope.currentPoi = null;
    $scope.sites = poi;
    $http.get(serverUrl +"poi/getCategories")
        .then(function(response){
            $scope.categories = response.data.Categories;
        },function(response){
            $scope.categories = "Something went wrong";
        })
$scope.getPoi = function(poiName) {
    $http.get(serverUrl +"poi/getSite/" + poiName)
    .then(function(response){
        $scope.currentPoi = response.data.Points_of_interests[0];
        $http.get(serverUrl +"poi/getSiteReviews/" + poiName)
        .then(function(response){
            $scope.currentPoi.Reviews = response.data.reviews;
         },function(response){
             $scope.currentPoi.Reviews = [];
        })
     },function(response){
         $scope.currentPoi = null;
    })
   
}

}]);

 $('#poi-Modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
  })