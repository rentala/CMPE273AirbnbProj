var app = angular.module('airbnbApp',[]);

app.config(['$locationProvider', function($locationProvider) {
	   $locationProvider.html5Mode(true);
	}]);


		app.controller('propertySearchController',function($scope,$http,$location){
			
			$scope.makeBid = function(property_id,description,minBid){
                var logEvent = function (data) {
                    $.ajax({
                        method: "POST",
                        url: "/log",
                        data: data
                    }).done(function(res) {
                        console.log(res)
                    });

                }
				if($scope.bid_amount ==undefined || $scope.bid_amount ==""){
					alert("Please enter a bid amount");
				}
				else if($scope.bid_amount <=minBid){
					alert("Please bid higher than $"+minBid);
				}
				else{
				$http({
		            method:"POST",
		            url:"/api/property/bidProperty",
		            data:{
		            	bid_amount:$scope.bid_amount,
		            	property_id:property_id,
		            	property_name:description
		            }
		        }).success(function(data){
		        	if(data.status_code == "200")
                        logData.type = "BIDACTIVITY";
                        logData.event = "User successfully bid an amount of " + $scope.bid_amount;
                        logEvent(logData)
		        		alert("Bid Submitted");
		        		window.location.reload();
		        })
				}
			}
			$scope.hasErrors = false;
			$scope.checkDateValidity = function () {
				if($scope.check_in < $scope.check_out)
				{
					$scope.hasErrors = false;
				}
				else {
					$scope.hasErrors = true;
				}

			}
			$scope.minDate = new Date();
			$scope.minDate = $scope.minDate > new Date(propertyDates.start_date) ? new Date(propertyDates.start_date) : $scope.minDate;
			$scope.MaxCheckOut = new Date(propertyDates.end_date);
			/*var mon = $scope.minDate.getMonth() + 1;
			$scope.minDate = $scope.minDate.getFullYear() + "-"
				+ mon + "-" +
				$scope.minDate.getDate();
				*/
			$scope.userActivityClick = function (event) {
				logData.type = "USERACTIVITY";
				logData.event = event;
				$.ajax({
					method: "POST",
					url: "/log",
					data: logData
				}).done(function(res) {
					console.log(res)
				});
			}
			$scope.editTrip = function(){
				var property_id = document.getElementById("property_id2").defaultValue;
				var trip_id = document.getElementById("trip_id2").defaultValue;
				var start_date = $scope.check_in;
				var end_date = $scope.check_out;
				var guests = document.getElementById("guests2").defaultValue;
				if($scope.hasErrors){
					alert("Enter Valid Dates")
				}
				else{
					if(start_date == undefined || end_date ==undefined){
						alert("Enter checkin and checkout dates");

					}
					else{
						$http({
							method:"POST",
							url:"/api/trip/editTrip",
							data:{
								property_id:property_id,
								trip_id:trip_id,
								guests:guests,
								start_date:start_date,
								end_date:end_date
							}
						}).success(function(data){
							if(data.status_code == "200"){
                                $scope.userActivityClick("User edits the trip");
								var diff = eval(data.newTripPrice-parseInt($scope.OldTripPrice));
								if(diff>0){
									alert("You will have to pay an additional amount.");
									window.location.assign("/api/property/paymentGateway/e/"+diff+"?pid=" + property_id);
								}
								else
									alert("Trip updated. No extra charges")
							}
							else{
								alert("Sorry, we cannot update trip for input dates");
							}
						})
					}
				}

			}
			$scope.hostPage = function(){
				window.location.assign("/host");
			}
			$scope.check_in = new Date();
			$scope.check_out = new Date();
			var queries = $location.search();
			var trip_id = queries.tip;
			$http({
	            method:"POST",
	            url:"/api/trip/fetchTripDetails",
	            data:{"trip_id":trip_id}
	        }).success(function(data){
	        	if(data.status_code == "200" ){
		        	$scope.tripData=data.tripData;
					$scope.OldTripPrice = $scope.tripData.trip_price;
		        	var checkin = new Date(data.tripData.checkin_date);
		        	checkin= new Date(checkin.getTime() + checkin.getTimezoneOffset()*60000);	
		        	var checkout = new Date(data.tripData.checkout_date);
		        	checkout= new Date(checkout.getTime() + checkout.getTimezoneOffset()*60000);	
		        	$scope.check_in = checkin;
		        	$scope.check_out = checkout;
					$scope.tripPrice = function(){ return Math.ceil(Math.abs($scope.check_out.getTime() - $scope.check_in.getTime()+1) / (1000 * 3600 * 24)) * propertyPrice ;};
	        	}
	        	else{
	        	}
	        })
		})