var app = angular.module('yourReservations',[]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', [ '$http' ,function ( $http) {
    this.uploadFileToUrl = function(file, uploadUrl,user_id,trip_id,index){
        var fd = new FormData();
        var comment =document.getElementById("comment").value;
        var rating = $('input:radio[name=rate'+index+']:checked').val();
        fd.append('file', file);
        fd.append('comment', comment);
        fd.append('rating', rating);
        fd.append('user_id', user_id);
        fd.append('trip_id', trip_id);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })

            .success(function(){
                alert("Review Submitted");
                window.location.reload();
            })

            .error(function(){
            });
    }
}]);
app.controller('yourReservationsController',['$scope','fileUpload','$http', function($scope, fileUpload, $http){
    $http({
        method:"GET",
        url:"/api/trip/reservations"
    }).success(function(data){
        $scope.list =false;
        $scope.list1 = true;
        if(data.status_code == "200" ){
            $scope.list = false;
            $scope.list1 = true;
            $scope.data=data.reservations;
        }
        else{
            $scope.list = true;
            $scope.list1 = false;
        }
    })
    
    $scope.submitReview = function(user_id,trip_id,index){
        var file = $scope.myFile;
        var uploadUrl = "/api/trip/submitHostReview";
        fileUpload.uploadFileToUrl(file, uploadUrl,user_id,trip_id,index);
    };
}])