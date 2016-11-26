var app = angular.module('airbnbApp',[]);
		app.controller('propertyDetailsController',function($scope,$http){
			
			$scope.image = "paris.jpg";
			$scope.profile = function(){
				alert("krishna");
			}
			$scope.logout = function(){
				alert("skdafhaskdjlfhksdjfhksdfhsfsdhf");
			}
			$scope.description = "Nice clean room in downtown San Jose";
			var address = [{street:"Alameda",state:"CA",city:"San Jose"}];
			$scope.address = address;
			$scope.ratings = "3.5/5";
			$scope.bedrooms = "2";
			$scope.guests = "3";

			var map;
			var infoWindow;
			// markersData variable stores the information necessary to each marker
			var markersData = [
				{
					lat: 40.6386333,
					lng: -8.745,
					name: "Camping Praia da Barrasdsjhss",
					address1:"Rua Diogo Cão, 125",
					address2: "Praia da Barra",
					postalCode: "3830-772 Gafanha da Nazaré" // don't insert comma in the last item of each marker
				}
			];


			function initialize() {
				var mapOptions = {
					center: new google.maps.LatLng(40.601203,-8.668173),
					zoom: 9,
					mapTypeId: 'roadmap',
				};

				map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

				// a new Info Window is created
				infoWindow = new google.maps.InfoWindow();

				// Event that closes the Info Window with a click on the map
				google.maps.event.addListener(map, 'click', function() {
					infoWindow.close();
				});

				// Finally displayMarkers() function is called to begin the markers creation
				displayMarkers();
			}
			google.maps.event.addDomListener(window, 'load', initialize);


			// This function will iterate over markersData array
			// creating markers with createMarker function
			function displayMarkers(){

				// this variable sets the map bounds according to markers position
				var bounds = new google.maps.LatLngBounds();

				// for loop traverses markersData array calling createMarker function for each marker
				for (var i = 0; i < markersData.length; i++){

					var latlng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
					var name = markersData[i].name;
					var address1 = markersData[i].address1;
					var address2 = markersData[i].address2;
					var postalCode = markersData[i].postalCode;

					createMarker(latlng, name, address1, address2, postalCode);

					// marker position is added to bounds variable
					bounds.extend(latlng);
				}

				// Finally the bounds variable is used to set the map bounds
				// with fitBounds() function
				map.fitBounds(bounds);
			}

			// This function creates each marker and it sets their Info Window content
			function createMarker(latlng, name, address1, address2, postalCode){
				var marker = new google.maps.Marker({
					map: map,
					position: latlng,
					title: name
				});

				// This event expects a click on a marker
				// When this event is fired the Info Window content is created
				// and the Info Window is opened.
				google.maps.event.addListener(marker, 'click', function() {

					// Creating the content to be inserted in the infowindow
					var iwContent = '<div id="iw_container">' +
							'<div class="iw_title">' + name + '</div>' +
							'<div class="iw_content">' + address1 + '<br />' +
							address2 + '<br />' +
							postalCode + '</div></div>';

					// including content to the Info Window.
					infoWindow.setContent(iwContent);

					// opening the Info Window in the current map and at the current marker location.
					infoWindow.open(map, marker);
				});
			}
			
			$scope.makeBid = function(property_id,description,bid_amount,minBid){
				if(bid_amount <=minBid){
					alert("Please bid higher than $"+minBid);
				}
				else{
				$http({
		            method:"POST",
		            url:"/api/property/bidProperty",
		            data:{
		            	bid_amount:bid_amount,
		            	property_id:property_id,
		            	property_name:description
		            }
		        }).success(function(data){
		        	if(data.status_code == "200")
		        		alert("Bid Submitted");
		        		window.location.reload();
		        })
				}
			}
		})