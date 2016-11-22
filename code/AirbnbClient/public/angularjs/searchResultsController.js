var app = angular.module('searchApp',[]);
    app.controller('searchController',function($scope,$http, $rootScope){
		alert($rootScope.valid_property);
    	$scope.valid_property=$rootScope.valid_property;
    });