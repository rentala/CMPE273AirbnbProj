var app = angular.module('myInbox',[]);
app.controller('myInboxController',function($scope,$http){
    $http({
        method: "POST",
        url: "/api/inbox/inboxContent"
    }).success(function (data) {
    if (data.status_code == "200") {
        $scope.details = data.result;
        $scope.biddings = data.biddings;
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
            if(data.status_code==200){
                alert('trip is accepted');
                window.location.reload();
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
        }).success(function(data){
            if(data.status_code==200){
                alert('trip is rejected');
                window.location.reload();
            }
        })
    }
    $scope.acceptBid = function(property_id, bidPrice,bidder_name,max_bid_user_id,bid_id){
        $http({
            method:"POST",
            url:"/api/trip/acceptBid",
            data:{
                "property_id":property_id,
                "bidPrice":bidPrice,
                "bidder_name":bidder_name,
                "user_id":max_bid_user_id,
                "bid_id":bid_id
            }
        }).success(function(data){
            if(data.status_code==200){
                alert('trip is rejected');
                window.location.reload();
            }
        })
    }
})