/**
 * New node file
 */
var app = angular.module('hostProfileApp',[]);
/*app.config(['$locationProvider', function($locationProvider) {
	   $locationProvider.html5Mode(true);
	}]);*/
//app.controller('hostProfileController',function($scope,$http,$location){
app.controller('hostProfileController',function($scope,$http){
	/*var queries = $location.search();
    $http({
        method:"POST",
        url:"/api/profile/getUserDetailsForProfile",
        data:{
        	user_id:queries.u
        }
    }).success(function(data){
    	 if(data.status_code==200){
            $scope.userPropertyDetails = data.userPropertyDetails;
            $scope.userDetails = data.userDetails;
            $scope.data = data;
         }
         else{
         	alert('Some error occurred! Please try again later');
             window.location.assign("/api/auth/home");
         }
    })*/
})