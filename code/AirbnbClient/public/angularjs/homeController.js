var app = angular.module('airbnbHome',[]);

app.controller('homeController',function($scope,$http){
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
               // alert("inside"+ data.valid_property);
                //console.log("Login successful");
                window.location.assign("/api/property/searchResult");
            }
            else if(data.status_code=="400"){
                $scope.loginError="Wrong email address or password";
            }
            else{
            	$rootScope.valid_property = "";
            	window.location.assign("/api/property/searchResult");
            }
        })
    }
});