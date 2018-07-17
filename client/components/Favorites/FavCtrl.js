angular.module("citiesApp")
        .controller("FavCtrl", ['$scope', 'PoiService', function ($scope, PoiService) {

            $scope.favoriteList = [{PointName: "a", Category: "nani", Image: "lala", Rate: 1},{PointName: "b", Image: "lala", Category: "mami", Rate: 3}, {PointName: "c", Image: "lala", Category: "tati", Rate: 5}];
            $scope.sortColumn = "name";
            $scope.reverseSort = false;

            $scope.sortData = function (column) {
                $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
                $scope.sortColumn = column;
            }

            $scope.getSortClass = function (column) {

                if ($scope.sortColumn == column) {
                    return $scope.reverseSort
                      ? 'arrow-down'
                      : 'arrow-up';
                }

                return '';
            }
        }]);

