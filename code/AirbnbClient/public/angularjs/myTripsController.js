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
	        		$scope.notrip1 = false;
		        	$scope.notrip = true;
		        	$scope.data=data.userTrips;
		        	console.log($scope.data);
	        	}
	        	else{
	        		$scope.notrip1 = true;
	        		$scope.notrip = false;
	        		$scope.data=null;	
	        	}
	        })	
	        
	        
	        $scope.viewBill = function(trip_id, billing_id){
    			window.open("/api/billing/viewBill?trip_id="+trip_id+"&bill_id="+billing_id,'Bill',directories=0);
    		}
    	})
