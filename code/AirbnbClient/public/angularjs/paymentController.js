var payment = angular.module('payment', []);


payment.controller('paymentController', function($scope, $http) {
$scope.submit= function(){
	var cardNum = $scope.cNumber;
	var expiryDate = $scope.expDate;
	var cvv = $scope.cvv;
	document.getElementById("description").defaultValue
	var data = {property_id:document.getElementById("property_id").defaultValue,
		            	host_id:document.getElementById("host_id").defaultValue,
		            	description:document.getElementById("description").defaultValue,
		            	city:document.getElementById("city").defaultValue,
		            	state:document.getElementById("state").defaultValue,
		            	start_date:document.getElementById("start_date").defaultValue,
		            	end_date:document.getElementById("end_date").defaultValue,
		            	price:document.getElementById("total").defaultValue, 
		            	guests:document.getElementById("guests").defaultValue, 
		            	country:document.getElementById("country").defaultValue}
	var patt = new RegExp("^\s*-?[0-9]{16}\s*$");
    var res = patt.test(cardNum);
	
    if(cardNum == undefined || cardNum==null || cardNum=="")
		alert("Enter Card Number");
    else if(!res)
    	alert("Card number should be 16 digits");
	else if(expiryDate == undefined || expiryDate=="")
		alert("Enter Expiry date");
	else if(cvv == undefined || cvv=="")
		alert("Enter CVV");
	else{
		var inputYear = expiryDate.getUTCFullYear();
		var dateObj = new Date();
		var year = dateObj.getUTCFullYear();
		var month = dateObj.getUTCMonth();
		var inputMonth = expiryDate.getUTCMonth();
		
		if(inputYear<year || (inputYear==year && inputMonth<month)){
			alert("Date of expiry should be future date");
		}
		else{
		$http({
		            method:"POST",
		            url:"/api/trip/createTrip",
		            data:{
		            	property_id:document.getElementById("property_id").defaultValue,
		            	host_id:document.getElementById("host_id").defaultValue,
		            	property_name:document.getElementById("description").defaultValue,
		            	city:document.getElementById("city").defaultValue,
		            	state:document.getElementById("state").defaultValue,
		            	start_date:document.getElementById("start_date").defaultValue,
		            	end_date:document.getElementById("end_date").defaultValue,
		            	price:document.getElementById("total").defaultValue, 
		            	guests:document.getElementById("guests").defaultValue, 
		            	country:document.getElementById("country").defaultValue
		            }
		        }).success(function(data){
		        	if(data.status_code == "200")
		        		alert("Success");
		        		window.location.assign("/api/auth/home");
		        })
		}
	}
}	
$scope.payDiff= function(){
	
	var cardNum = $scope.cNumber;
	var expiryDate = $scope.expDate;
	var cvv = $scope.cvv;
	var patt = new RegExp("^\s*-?[0-9]{16}\s*$");
    var res = patt.test(cardNum);
	
    if(cardNum == undefined || cardNum==null || cardNum=="")
		alert("Enter Card Number");
    else if(!res)
    	alert("Card number should be 16 digits");
	else if(expiryDate == undefined || expiryDate=="")
		alert("Enter Expiry date");
	else if(cvv == undefined || cvv=="")
		alert("Enter CVV");
	else{
		var inputYear = expiryDate.getUTCFullYear();
		var dateObj = new Date();
		var year = dateObj.getUTCFullYear();
		var month = dateObj.getUTCMonth();
		var inputMonth = expiryDate.getUTCMonth();
		
		if(inputYear<year || (inputYear==year && inputMonth<month)){
			alert("Date of expiry should be future date");
		}
		else{
			alert("Success Payment");
			window.location.assign("/api/auth/home");
		}
		}	
	}
})
