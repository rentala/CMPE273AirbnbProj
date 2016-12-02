var app = angular.module('deleteApp',[]);
app.controller('deleteController',function($scope,$http){
    $scope.deactivateAccount = function () {
        console.log("entered controller");
        $http({
            method:"POST",
            url:"/api/profile/deleteUser"
        }).success(function (data) {

            if(data.status_code == "200"){
                alert("Your account has been deactivated and you will no longer have access to your details")
                setTimeout(function(){
                    window.location = '/api/auth/logout';
                },5000);
            }
        })
    }
})