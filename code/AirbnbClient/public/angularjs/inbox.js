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
    $scope.acceptTrip = function(trip_id){
        $http({
            method:"POST",
            url:"/api/trip/updateTrip",
            data:{
                "status":"ACCEPTED",
                "trip_id":trip_id
            }
        }).success(function(data){
            if(status_code==200){

            }
        })
    }
    $scope.rejectTrip = function(trip_id){
        $http({
            method:"POST",
            url:"/api/trip/updateTrip",
            data:{
                "status":"REJECTED",
                "trip_id":trip_id
            }
        })
    }
})