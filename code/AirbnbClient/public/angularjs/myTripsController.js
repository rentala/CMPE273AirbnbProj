var app = angular.module('myTrip',[]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', [ '$http' ,function ( $http) {
    this.uploadFileToUrl = function(file, uploadUrl,property_id,trip_id,index){
        var fd = new FormData();
        var comment =document.getElementById("comment").value;
        var rating = $('input:radio[name=rate'+index+']:checked').val();
        fd.append('file', file);
        fd.append('comment', comment);
        fd.append('rating', rating);
        fd.append('property_id', property_id);
        fd.append('trip_id', trip_id);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })

            .success(function(){
                document.getElementById("msg").innerHTML = "Review Submitted";
                window.location.reload();
            })

            .error(function(){
            });
    }
}]);

app.controller('myTripController',['$scope','fileUpload','$http', function($scope, fileUpload, $http){
    $scope.notrip1=true;
    $scope.notrip=false;
    $http({
        method:"GET",
        url:"/api/trip/myTripDetails"
    }).success(function(data){
        $scope.notrip =false;
        $scope.list1 = true;
        if(data.status_code == "200" ){
            $scope.notrip1 = false;
            $scope.notrip = true;
            $scope.data=data.userTrips;
            $scope.user_id=data.user_id;
            var a;
            var userTrips = data.userTrips;
            var rating;
            for (i = 0; i < userTrips.length; i++) {
                if(userTrips[i].trip_status=="COMPLETED"){
                    rating = userTrips[i].rating;
                    a=i;
                    var $radios = $('input:radio[name=rate'+a+']');
                    if($radios.is(':checked') === false) {
                        if(rating ==1)
                            $radios.filter('[value=1]').prop('checked', true);
                        else if(rating ==2)
                            $radios.filter('[value=2]').prop('checked', true);
                        else if(rating =='3')
                            $radios.filter('[value=3]').prop('checked', true);
                        else if(rating ==4)
                            $radios.filter('[value=4]').prop('checked', true);
                        else if(rating ==5)
                            $radios.filter('[value=5]').prop('checked', true);
                    }
                }
            }
        }
        else{
            $scope.notrip1 = true;
            $scope.notrip = false;
            $scope.data=null;
        }
    })


    $scope.viewBill = function(trip_id, billing_id){
        window.open("/api/billing/viewBill?trip_id="+trip_id+"&bill_id="+billing_id,'Bill',directories=0);
    }

    $scope.submitReview = function(property_id,trip_id,index){
        var file = $scope.myFile;
        var uploadUrl = "/api/trip/submitReview";
        fileUpload.uploadFileToUrl(file, uploadUrl,property_id,trip_id,index);
    };
    $scope.editTrip = function(trip_id, property_id,price){
        window.location.assign("/api/property/id/" + property_id +"/edit?tip="+trip_id );
        //window.location.assign("/api/trip/id/"+property_id+"/"+price+"/edit/"+trip_id);
    }
    $scope.payNow = function(trip_id,trip_price){
    	window.location.assign("/api/property/paymentGateway/b/"+trip_id+"/"+trip_price);
    }
    $scope.searchByCity = function(){
    	//alert(1);
    	var whereTo = $scope.searchCity;
    	if(whereTo)
    	window.location.assign("/api/auth/home?c="+whereTo);
    	else
    		window.location.assign("/api/auth/home");	
    }
    
 $scope.deleteTrip = function(trip_id){
    	
    	$http({
            method:"POST",
            url:"/api/trip/deleteTrip",
            data:{trip_id:trip_id}
        }).success(function(data){
            if(data.status_code == "200" ){
            	window.location.assign("/api/profile/myTrips");
            }
            else{
            	alert("error");
            	window.location.assign("/api/auth/home");	
            }
        })
    	
    }
}])