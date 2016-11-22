
app.controller('homeController',function($scope,$http,$state,$rootScope){
    $scope.hostPage = function(){
        window.location.href = "/host";
    }
    $scope.trips=function(){
        $http({
            "method":"POST",
            "url":"/trips"
        })
    }
    
    $scope.search=function(){
        $http({
            "method":"POST",
            "url":"/api/property/search"
        })
    }
});