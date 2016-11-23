var app = angular.module('myTrip',[]);
    	app.controller('myTripController',function($scope,$http){
    		$scope.notrip1=true;
    		$scope.notrip=false;
    		$http({
	            method:"GET",
	            url:"/api/trip/myTripDetails"
	            }).success(function(data){
	        	$scope.notrip =false;
	        	$scope.list1 = true;
	        	if(data.status_code == "200" ){
	        		$scope.list = false;
		        	$scope.notrip1 = true;
		        	$scope.data=data.records;
	        	}
	        	else{
	        		$scope.notrip = true;
	        		$scope.notrip1 = false;
	        		$scope.data=null;	
	        	}
	        })	
    	})
