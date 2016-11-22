
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
    
    $scope.search=function(){
        $http({
            "method":"POST",
            "url":"/api/property/search",
            data : {
				"city" : $scope.whereTo,
				"guests" : $scope.guests,
				"start_date": $scope.start_date,
				"end_date": $scope.end_date
			}
        }).success(function(data){
            if(data.status_code=="200"){
                //$('.modal-backdrop').remove();
               // $rootScope.user_dtls = JSON.parse(data.user);
                alert("inside");
                //console.log("Login successful");
                window.location.assign("/api/auth/home");
            }
            else if(data.status_code=="400"){
                $scope.loginError="Wrong email address or password";
            }
        })
    }
});