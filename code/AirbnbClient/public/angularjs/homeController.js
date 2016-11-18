
app.controller('homeController',function($scope,$http,$state,$rootScope){
    $scope.searchProperty=function(){
        $http({
            "method":"POST",
            "url":"/search",
            "data":{
                "city":$scope.city,
                "start_date":$scope.start_date,
                "end_date":$scope.end_date,
                "guests":$scope.guests

            }
        }).success(function(data){
            if(data.status_code=="200"){
                $scope.valid_property=data.valid_property;
            }
            else if(data.status_code=="401"){
                $scope.errMsg=data.errMsg;
            }
            else if(data.status_code=="402"){
                $scope.errMsg=data.errMsg;
            }
        })
    }
});