
app.controller('loginSignupController',function($scope,$http,$state,$rootScope){

    $scope.signUp = function(){
        alert("requested signUp");

        if($scope.firstName!="" && $scope.lastName!="" && $scope.email!="" && $scope.password!="" && $scope.Dob!="" && $scope.street!="" && $scope.city!="" && $scope.state!="" && $scope.zipCode!="" && $scope.phoneNumber!="" && $scope.ssn!="" && $scope.aptNum!=""){
            $http({
                method:"POST",
                url:"/registerUser",
                data:{
                    "firstName":$scope.firstName,
                    "lastName":$scope.lastName,
                    "email":$scope.email,
                    "password":$scope.password,
                    "birthdate":$scope.Dob,
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
                    $rootScope.user_dtls = JSON.parse(data.user);
                    $state.go('home');
                    console.log("Sign Up successful");
                }
                else if(data.statusCode=="400"){
                    $scope.signUpError="User already exists please use different username";
                }
            })
        }
        else{
            $scope.error="please enter all the field contents";
        }
    };
    $scope.logIn = function(){
        $http({
            method:"POST",
            url:"/logIn",
            data:{
                "email":$scope.emailAddress,
                "password":$scope.password
            }
        }).success(function(data){
            if(data.statusCode=="200"){
                console.log("Login successful");
            }
            else if(data.statusCode=="400"){
                $scope.loginError="Wrong email address or password";
            }
        })
    }
});
