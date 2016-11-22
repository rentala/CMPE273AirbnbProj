var app = angular.module('searchApp',[]);
    app.controller('searchController',function($scope,$http, $rootScope){
    	$http({
            method:"POST",
            url:"/api/property/getResults"
        }).success(function(data){
        	$scope.valid_property=data.valid_property;
        	alert(data.valid_property);
        })
    });