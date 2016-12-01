 var app = angular.module('airbnbApp', []);
        app.controller('hostController',function($scope){
            $scope.isBid = "0";
            
            $scope.searchByCity = function(){
            	//alert(1);
            	var whereTo = $scope.city;
            	window.location.assign("/api/auth/home?c="+whereTo);
            }
        });