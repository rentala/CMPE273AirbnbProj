var app = angular.module('deleteApp',[]);
app.controller('deleteController',function($scope,$http){
    $scope.deactivateAccount = function () {
        console.log("entered controller");
        $http({
            method:"POST",
            url:"/api/profile/deleteUser"
        }).success(function (data) {

            if(data.status_code == "200"){
                setTimeout(function(){
                    window.location = '/api/auth/logout';
                },5000);
            }
        })
    }
})