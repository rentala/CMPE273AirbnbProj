var app = angular.module('yourListing',[]);
app.controller('yourListingController',function($scope,$http){
    $http({
        method:"POST",
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
            $scope.data=null;
        }
    })
})