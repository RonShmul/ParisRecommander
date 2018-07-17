angular.module('citiesApp')
  .controller('FavoritePoiCtrl', function($scope) {
    $scope.press = false;
    $scope.likeFunction = function(press) {
			
    };
  })
  .directive('heartLike',
	function() {
		return {
			restrict : 'A',
			template : '<ul class="rating">'
					 + '	<li ng-model="heart" ng-class="heart" ng-click="handleLike()">'
					 + '\u2661'
					 + '</li>'
					 + '</ul>',
			scope : {
				isLiked : '=',
				onLikeSelected : '&'
			},
			link : function(scope, elem, attrs) {
				var updateHeart = function(val) {
                    scope.heart = {
                        heartFill: val
                    }
				};
				
				scope.handleLike = function() {
					scope.isLiked = !scope.isLiked;
					scope.onLikeSelected({
						press : scope.isLiked
					});
				};
				
				scope.$watch('isLiked',
					function(oldVal, newVal) {
							updateHeart(newVal);
					}
				);
			}
		};
	}
);