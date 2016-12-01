/**
 * New node file
 */
var app = angular.module('hostProfileApp',[]);
app.controller('hostProfileController',function($scope,$http){

    $http({
        method:"POST",
        url:"/api/profile/getUserDetailsForProfile"
    }).success(function(data){

    })
})