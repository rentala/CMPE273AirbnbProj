 var app = angular.module('airbnbApp', []);
 app.config(['$locationProvider', function($locationProvider) {
	   $locationProvider.html5Mode(true);
	}]);
        app.controller('hostController',function($scope,$location){
            $scope.isBid = "0";
            
            var queries = $location.search();
        	if(queries.err=='3'||queries.err==3){
        		alert("End date should be greater than start date");
        	}
        	else if(queries.err=='InvalidHost'){
        		alert("You are not allowed to host any property");
        	}
            $scope.searchByCity = function(){
            	//alert(1);
            	var whereTo = $scope.city;
            	if(whereTo)
            	window.location.assign("/api/auth/home?c="+whereTo);
            	else
            		window.location.assign("/api/auth/home");	
            }
            $scope.logout = function(){
            	window.location.assign("/api/auth/logout");
            }
            $scope.home = function(){
            	window.location.assign("/api/auth/home");
            }
            $scope.trips = function(){
            	window.location.assign("/api/profile/myTrips");
            }
        });