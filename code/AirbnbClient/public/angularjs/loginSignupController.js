var app = angular.module('airbnbApp',[]);
app.controller('loginSignupController',function($scope,$http){

    $scope.signUp = function(){
        $scope.signUpError="";
        $scope.loginError = "";
        var zipPatt = new RegExp("^[0-9]{5}(-[0-9]{4})?$");
        var validZip = zipPatt.test($scope.zipCode);	
        
        var ssnPatt = new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{3}$");
        var validSSN = ssnPatt.test($scope.ssn);	
        
        if(!($scope.firstName!= null && $scope.lastName!=null && $scope.email!=null && $scope.password!=null && $scope.Dob!=null && $scope.street!=null && $scope.city!=null && $scope.state!=null && $scope.zipCode!=null && $scope.phoneNumber!=null && $scope.ssn!=null && $scope.aptNum!=null
            && $scope.firstName!= "" && $scope.lastName!="" && $scope.email!="" && $scope.password!="" && $scope.Dob!="" && $scope.street!="" && $scope.city!="" && $scope.state!="" && $scope.zipCode!="" && $scope.phoneNumber!="" && $scope.ssn!="" && $scope.aptNum!="")){
        	$scope.signUpError="please enter all the field contents";
        }
        else if(!validZip){
        	$scope.signUpError="Zip should be in these formats - 12345 or 12345-1111";
        }
        else if(!validSSN){
        	$scope.signUpError="SSN is invalid. Correct format - 123-123-123";
        }
        else{
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
                    "aptNum":$scope.aptNum,
                    "city":$scope.city,
                    "state":$scope.state,
                    "zipCode":$scope.zipCode,
                    "phoneNumber":$scope.phoneNumber,
                    "ssn":$scope.ssn
                }
            }).success(function(data){
                if (data.status_code=="200") {
                    $('.modal-backdrop').remove();
                    window.location.assign("/api/auth/home");
                }
                else if(data.status_code=="400"){
                    $scope.signUpError="Email already registered please use different email";
                }
                else if(data.status_code=="402"){
                    $scope.signUpError="Zip should be in these formats - 12345 or 12345-1111";
                }
                else if(data.status_code=="403"){
                    $scope.signUpError="SSN is invalid. Correct format - 123-123-123";
                }
            })
        }
    };
    $scope.logIn = function(){
        if(!($scope.emailAddress!= null && $scope.password!=null && $scope.emailAddress!= "" && $scope.password!="" )){
            $scope.loginError="Email and password are mandatory";
        }
        else{
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
    }
    $scope.showSignUp = function () {
        $('#myModal1').modal('hide');
        $('#myModal').modal('show');
    }
});
