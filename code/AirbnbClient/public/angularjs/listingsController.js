 var app = angular.module('myListing',[]);
        app.controller('myListingController',function($scope,$http){
        	$http({
	            method:"GET",
	            url:"/api/property/myListings"
	        }).success(function(data){
	        	
	        	$scope.data=data.records;
	        	
	        })	
        	
        	
        })