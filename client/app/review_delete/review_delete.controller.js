'use strict';


class ReviewDeleteController {
  errors = {};

  constructor(Review, $scope, $stateParams, $http, $state) {
    this.Review = Review;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$state = $state;

    this.Review.get({ id: $stateParams.myrvId}).$promise
      .then((res) => {
        this.rvdelete = res;
        console.log(res);
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

      });



  }
  del(){
    this.$http.delete('/api/reviews/' + this.$stateParams.myrvId, this.rvdelete)
      .then((res) => {
        alert('success');
        this.$state.go('myreview');
      })
      .catch(err => {
        err = err.data;
        this.errors = {};

      });

  }
}
angular.module('projectHeoApp')
  .controller('ReviewDeleteController', ReviewDeleteController);


