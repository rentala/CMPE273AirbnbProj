/**
 * Created by krishna.r.k on 11/18/2016.
 */
app.controller('adminController',function($scope,$http,$state,$rootScope){

    $scope.logIn = function(){
        $http({
            method:"POST",
            url:"/api/admin/adminCheckLogin",
            data:{
                "email":$scope.emailAddress,
                "password":$scope.password
            }
        }).success(function(data){
            if(data.status_sode=="200"){
                $('.modal-backdrop').remove();
                //console.log("Login successful");
                $state.go('home');
            }
            else if(data.status_code=="400"){
                $scope.loginError="Wrong email address or password";
            }
        })
    }
});

