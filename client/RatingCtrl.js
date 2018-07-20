angular.module('citiesApp')
  .controller('RatingCtrl', ['setToken', '$rootScope', '$http', 'localStorageModel', 'PoiService', '$scope', function(setToken, $rootScope, $http, localStorageModel, PoiService, $scope) {
	let serverUrl = 'http://localhost:3000/';
	$scope.userReview = "";
	$scope.rating = 0;
	
	$rootScope.$on('poi:activepoi', function(event, data) {
        for(var i = 0; i < data.Reviews.length; i++) {
			if(data.Reviews[i].Username === $scope.User.Username) {
				$scope.rating = PoiService.activePoi.Reviews[i].Rate;
			}
		}
	});

	//rate function when choose amount of stars in the directive
    $scope.rateFunction = function(rating) {
		var tokenData = localStorageModel.get('token');
		setToken.set(tokenData);
		let Rate = {
			PointName: PoiService.activePoi.PointName,
			Rate: rating
		};
		$http.post(serverUrl +"users/auth/AddRate", Rate)
			.then(function(response){
				$scope.rating = rating;
			}, function(response) {});
	};

	//submit a review to DB
	$scope.reviewFunction = function() {
		var tokenData = localStorageModel.get('token');
		setToken.set(tokenData);
		let Review = {
			PointName: PoiService.activePoi.PointName,
			Review: $scope.userReview
		};
		$http.post(serverUrl +"users/auth/addReview", Review)
			.then(function(response){
				// Reset clases of the form after submit.
				PoiService.activePoi.Reviews.push($scope.userReview);
				$scope.userReview = "";
				$scope.form.$setPristine();
			}, function(response) {});
		
	}

  }])
  .directive('starRating',
	function() {
		return {
			restrict : 'A',
			template : '<ul class="rating">'
					 + '	<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
					 + '\u2605'
					 + '</li>'
					 + '</ul>',
			scope : {
				ratingValue : '=',
				max : '=',
				onRatingSelected : '&'
			},
			link : function(scope, elem, attrs) {
				var updateStars = function() {
					scope.stars = [];
					for ( var i = 0; i < scope.max; i++) {
						scope.stars.push({
							filled : i < scope.ratingValue
						});
					}
				};
				
				scope.toggle = function(index) {
					scope.ratingValue = index + 1;
					scope.onRatingSelected({
						rating : index + 1
					});
				};
				
				scope.$watch('ratingValue',
					function(oldVal, newVal) {
						if (newVal) {
							updateStars();
						}
					}
				);
			}
		};
	}
);