var app = angular.module('myInbox',[]);
app.controller('myInboxController',function($scope,$http){
    $scope.data1=false;
    $scope.data2=false;
    $scope.data3=false;
    $scope.data4=false;
    $http({
        method: "POST",
        url: "/api/inbox/inboxContent"
    }).success(function (data) {
    if (data.status_code == "200") {
        $scope.host_id = data.host_id;
        if (data.result.length>0){
            $scope.data1=true;
            $scope.data2=false;
        $scope.details = data.result;
        }else{
            $scope.data1=false;
            $scope.data2=true;
        }
        if(data.biddings.length>0){
            $scope.data3=true;
            $scope.data4=false;
            $scope.biddings = data.biddings;
        }else{
            $scope.data3=false;
            $scope.data4=true;
        }
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
    $scope.acceptBid = function(property_id, bidPrice,bidder_name,max_bid_user_id,bid_id, property_name){
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
                var logEvent = function (data) {
                    $.ajax({
                        method: "POST",
                        url: "/log",
                        data: data
                    }).done(function(res) {
                        console.log(res)
                    });

                };
                logEvent({ host_id: $scope.host_id, property_id: property_id,property_name : property_name, event: "Bid accepted by host for amount" + bidPrice,  type : "BIDACTIVITY"})
                alert('Bid accepted');
                window.location.reload();
            }
        })
    }
    $scope.rejectBid = function(property_id, bidPrice,bidder_name,max_bid_user_id,bid_id, property_name){
        $http({
            method:"POST",
            url:"/api/trip/rejectBid",
            data:{
                "bid_id":bid_id
            }
        }).success(function(data){
            if(data.status_code==200){
                logEvent({ host_id: $scope.host_id, property_id: property_id,property_name : property_name, event: "Bid rejected by host for amount" + bidPrice,  type : "BIDACTIVITY"})
                alert('Bidding rejected');
                window.location.reload();
            }
        })
    }
})