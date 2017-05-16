'use strict';


class ReviewUploadController {

  review_upload = {};

  constructor(Review, $state, $scope, $http, Upload) {
    this.Review = Review;
    this.$state  = $state;
    this.$scope = $scope;
    this.$http = $http;
    this.Upload = Upload;

    $scope.items = [
      'programming', 
      'design', 
      'business', 
      'plan',
      'image',
      'photo',
      'marketing',
      'broadcasting',
      'fashion',
      'economic',
      'volunteer',
      'thesis',
      'education ',
      'welfare',
      'story',
      'idea',
      'sports',
      'finance',
      'advertising'

    ].map((v) => ({ name: v }));

    const Checker = (limit) => {
      return (items) => {
        const itemNum = items.filter((item) => item.ischecked).length;
        return itemNum === limit;
      };
    };

    $scope.ItemsOver = Checker(3);

    $scope.tags = [];
    $scope.rvtypes = [
      '포트폴리오', 
      '공모전',
      '기타'
    ].map((v) => ({ name: v })); 


    $scope.loadTags = (query) => {
      return $http.get('/api/reviews/get-tags', { 
        params: { q: query }
      }).then((res) => res.data.map((el) => el._id));
    };

    $scope.loadUser = (query) => {
      return $http.get('/api/reviews/get-users', { 
        params: { q: query }
      }).then((res) => res.data.map((el) => el._id)); 
    };
    $scope.rates = [];

  }

  upload(form) {
    this.submitted = true;
    const checked_field = this.$scope.items
      .filter((item) => item.ischecked)
      .map((item) => item.name);
    this.rvupload.field= checked_field;

    const input_tags = this.$scope.tags
      .map((tag) => tag.text);
    this.rvupload.tags = input_tags; 



    console.log(this.rvupload);
    console.log(this.rvupload.projfile);


    if (form.$valid) {
      this.Upload.upload({
        url: '/api/reviews',
        method: 'POST',
        data: {
          _creator: this.rvupload._creator, 
          title: this.rvupload.title,
          field: this.rvupload.field, 
          tags: this.rvupload.tags, 
          link : this.rvupload.link, 
          projFile: this.rvupload.projfile,
          content: this.rvupload.content
        }
      })
        .then(() => {
          alert('success'); 
          this.$state.go('review_list');
          //location.reload();
        })
        .catch(err => {
          err = err.data;
          this.errors = {};
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }




}
angular.module('projectHeoApp')
  .controller('ReviewUploadController', ReviewUploadController);

