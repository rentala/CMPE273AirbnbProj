var app = angular.module('myInbox',[]);
app.controller('myInboxController',function($scope,$http){
    $http({
        method: "POST",
        url: "/api/inbox/inboxContent"
    }).success(function (data) {
    if (data.status_code == "200") {
        $scope.details = data.result;
    }
     else {
        console.log("vhhvnv");
    }
    })
    $scope.acceptTrip = function(){

    }
})