var app = angular.module('yourReservations',[]);
app.controller('yourReservationsController',function($scope,$http){
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
            $scope.data=null;
        }
    })
})