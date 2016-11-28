/*var app = angular.module('myInbox',[]);
app.controller('myInboxController',function($scope,$http){

    $scope.some = function() {
        $http({
            method: "POST",
            url: "/api/inbox/inboxContent"
        }).success(function (data) {
            if (data.status_code == "200") {
                $scope.details = data.userDetails;
            }
            else {
                console.log("vhhvnv");
            }
        })
    }
})*/