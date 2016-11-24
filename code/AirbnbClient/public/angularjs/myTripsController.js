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
    this.uploadFileToUrl = function(file, uploadUrl,property_id){
        var fd = new FormData();
        var comment =document.getElementById("comment").value;
		var rating = $('input:radio[name=rate]:checked').val();
        fd.append('file', file);
        fd.append('comment', comment);
        fd.append('rating', rating);
        fd.append('property_id', property_id);
        
        $http.post(uploadUrl, fd, {
           transformRequest: angular.identity,
           headers: {'Content-Type': undefined}
        })

        .success(function(){
        	document.getElementById("msg").innerHTML = "Success";
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
					$scope.data=data.user;
		        	$scope.user_id=data.user_id;
		        	console.log($scope.data);
	        	}
	        	else{
	        		$scope.notrip1 = true;
	        		$scope.notrip = false;
					$scope.data=data.user;
	        		$scope.data=null;	
	        	}
	        })	
	        
	        
	        $scope.viewBill = function(trip_id, billing_id){
    			window.open("/api/billing/viewBill?trip_id="+trip_id+"&bill_id="+billing_id,'Bill',directories=0);
    		}
    		
    			$scope.submitReview = function(property_id){
    		           var file = $scope.myFile;
    		           var uploadUrl = "/api/trip/submitReview";
    		           fileUpload.uploadFileToUrl(file, uploadUrl,property_id);
    		        };
    	}])
