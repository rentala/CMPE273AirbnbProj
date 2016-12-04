var app = angular.module('reviewsApp',[]);
app.controller('reviewsController',function($scope,$http){
    $scope.review1=false;
    $scope.review2=false;
    $http({
        method:"POST",
        url:"/api/profile/loadProfile"
    }).success(function(data){
        if(data.status_code == "200"){
            if(data.user.reviews!=undefined){
                $scope.review2=false;
                $scope.review1=true;
            $scope.reviews = data.user.reviews;
            console.log("user reviews"+data.user.reviews);
            }
            else{
                $scope.review1=false;
                $scope.review2=true;
               // $scope.reviews = data.user.reviews;
            }
        }
    })
})