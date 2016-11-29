var app = angular.module('airbnbApp',[]);
app.controller('loginSignupController',function($scope,$http){

    $scope.signUp = function(){

        if($scope.firstName!= null && $scope.lastName!=null && $scope.email!=null && $scope.password!=null && $scope.Dob!=null && $scope.street!=null && $scope.city!=null && $scope.state!=null && $scope.zipCode!=null && $scope.phoneNumber!=null && $scope.ssn!=null && $scope.aptNum!=null){
            $http({
                method:"POST",
                url:"/api/auth/signUpUser",
                data:{
                    "firstName":$scope.firstName,
                    "lastName":$scope.lastName,
                    "email":$scope.email,
                    "password":$scope.password,
                    "Dob":$scope.Dob,
                    "street":$scope.street,
                    "address":$scope.aptNum,
                    "city":$scope.city,
                    "state":$scope.state,
                    "zipCode":$scope.zipCode,
                    "phoneNumber":$scope.phoneNumber,
                    "ssn":$scope.ssn
                }
            }).success(function(data){
                if (data.status_code=="200") {
                    $('.modal-backdrop').remove();
                    //$rootScope.user_dtls = JSON.parse(data.user);
                    //$state.go('home');
                    // console.log("Sign Up successful");
                    window.location.assign("/api/auth/home");
                }
                else if(data.status_code=="400"){
                    $scope.signUpError="User already exists please use different username";
                }
            })
        }
        else{
            console.log("reached");
            $scope.signUpError="please enter all the field contents";
        }
    };
    $scope.logIn = function(){
        $http({
            method:"POST",
            url:"/api/auth/signInUser",
            data:{
                "email":$scope.emailAddress,
                "password":$scope.password
            }
        }).success(function(data){
            if(data.status_code=="200"){
                $('.modal-backdrop').remove();
                window.location.assign("/api/auth/home");
            }
            else if(data.status_code=="400"){
                $scope.loginError="Wrong email address or password";
            }
        })
    }
});
