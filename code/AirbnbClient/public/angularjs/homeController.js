var app = angular.module('airbnbHome',[]);
app.config(['$locationProvider', function($locationProvider) {
	   $locationProvider.html5Mode(true);
	}]);

app.controller('homeController',function($scope,$http,$location){
	var queries = $location.search();
	$scope.whereTo = queries.c;
    $scope.search=function(){
    	if($scope.whereTo ==undefined || $scope.guests ==undefined || $scope.start_date ==undefined || $scope.end_date ==undefined){
    		alert("Please fill all search criterias");
    	}
    	else{
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
	                $('.modal-backdrop').remove();
	               // $rootScope.user_dtls = JSON.parse(data.user);
	               // alert("inside"+ data.valid_property);
	                //console.log("Login successful");
	                window.location.assign("/api/property/searchResult");
	            }
	            else if(data.status_code=="401"){
	            	window.location.assign("/api/property/searchResult");
	            }
	            else{
	            	$rootScope.valid_property = "";
	            	window.location.assign("/api/property/searchResult");
	            }
	        })
    	}
    }
    
    $scope.searchByCity = function(){
    	$scope.whereTo = $scope.city;
    }
});