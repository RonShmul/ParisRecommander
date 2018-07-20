angular.module('citiesApp')
  .controller('FavCtrl', ['localStorageModel', 'PoiService', '$scope', function(localStorageModel, PoiService, $scope) {
    /*variables*/
    $scope.press = false;
    $scope.favoritesList = PoiService.getFavoritesList();
    $scope.sortColumn = "PointName";
    $scope.reverseSort = false;

    //update the press variable for the directive
    $scope.$watch('activePoi', function(oldVal, newVal) {
        if(newVal) {
            $scope.press = PoiService.checkPoiInFavorites();
        }
    });

    //when heart icon is pressed - add or remove poi from favorites
    $scope.likeFunction = function(press) {
        PoiService.updateFavorites(press);
    };

    //sort function by column name
    $scope.sortData = function (column) {
        $scope.favoritesList.sort(function(poi1, poi2) {
            if(poi1[column] < poi2[column])
                return -1;
            if(poi1[column] > poi2[column])
                return 1;
            return 0;
        });
    }
    
    // arrow sign todo: fix it
    $scope.getSortClass = function (column) {

        if ($scope.sortColumn == column) {
            return $scope.reverseSort
              ? 'arrow-down'
              : 'arrow-up';
        }

        return '';
    }

    //remove poi from favorites when press the 'X' (remove) button
    $scope.removePoiFromFav = function(PoiName) {
        PoiService.removeFromFav(PoiName);
        $scope.favoritesList = PoiService.getFavoritesList();
    }

    //save the favorite list to DB
    $scope.saveFavoriteList = function() {
        PoiService.saveFavoriteList().then(function(isSaved) {
            if(isSaved) {
              //todo
            } else {
                //todo
            }
        });
    }

    //sort favorites list manually
    $scope.upPoi = function(poiName) {
        for(var i = 0; i < $scope.favoritesList.length; i++) {
            if($scope.favoritesList[i].PointName === poiName && i != 0) {
                var temp = $scope.favoritesList[i];
                $scope.favoritesList[i] = $scope.favoritesList[i-1];
                $scope.favoritesList[i-1] = temp;
                PoiService.userFavoritesList = $scope.favoritesList;
                return;
            }
        }

    }

    $scope.downPoi = function(poiName) {
        for(var i = 0; i < $scope.favoritesList.length; i++) {
            if($scope.favoritesList[i].PointName === poiName && i != $scope.favoritesList.length-1) {
                var temp = $scope.favoritesList[i];
                $scope.favoritesList[i] = $scope.favoritesList[i+1];
                $scope.favoritesList[i+1] = temp;
                PoiService.userFavoritesList = $scope.favoritesList;
                return;
            }
        }
    }

    //update controller's list when service list is changed
    $scope.$watch('userFavoritesList', function(oldVal, newVal) {
        $scope.favoritesList = PoiService.getFavoritesList();
    });

  }])
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
							updateHeart(oldVal);
					}
				);
			}
		};
	}
);