'use strict';

class ReviewViewController {

  constructor(Review, $scope, $stateParams, $http) {
    this.Review = Review;
    this.$scope = $scope;
    this.$stateParams = $stateParams;

    this.Review.get({ id: $stateParams.pid }).$promise
      .then((res) => {
        this.rvview = res;

        var path = res.projFile;

        if(res.filename == null){
          $scope.downloadname = "파일 없음";
          $scope.objectUrl = "none";
        }else{
          $scope.downloadname = res.filename;
          $scope.objectUrl = "./"+path.slice(2,path.length);
        }
        console.log($scope.objectUrl);
        console.log($scope.downloadname);

        $scope.count = this.rvview.like;
        $scope.myFunc = function() {

          $scope.active = !$scope.active;
          if($scope.active === true){
            $scope.count++;
            $http.post('/api/reviews/' + $stateParams.pid , { like: $scope.count });
          }
          else{
            $scope.count--;
            $http.post('/api/reviews/' + $stateParams.pid , { like: $scope.count });
          }




        };

      });
  }


}
angular.module('projectHeoApp')
  .controller('ReviewViewController', ReviewViewController);


