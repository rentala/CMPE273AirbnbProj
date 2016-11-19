
app.controller('homeController',function($scope,$http,$state,$rootScope){
    $scope.becomeHostPage = function(){
        $http({
            "method":"POST",
            "url":"/host",

        }).success(function(data){

        })
    }

    $scope.trips=function(){
        $http({
            "method":"POST",
            "url":"/trips"
        })
    }
});