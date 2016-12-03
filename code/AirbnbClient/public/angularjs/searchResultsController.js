var app = angular.module('searchApp',[]);
    app.controller('searchController',function($scope,$http, $rootScope){
        var map;
        var infoWindow;
        var markerData;
    	var valid_property1;
    	$http({
            method:"POST",
            url:"/api/property/getResults"
        }).success(function(data) {


            $scope.valid_property = data.valid_property;
            if (data.valid_property == undefined) {
            $scope.myvar1 = true;
                $scope.myvar = false;
            }
            else {
                $scope.valid_property = data.valid_property;
                valid_property1 = data.valid_property;
                $scope.myvar = true;
                $scope.myvar1 = false;
                //console.log("hahah = " + (Number(valid_property1[0].coordinates.x)));
                console.log("lat and long is:" + data.valid_property[0].coordinates.x);
                console.log(data.valid_property);
                //valid_property=data.valid_property;
                initialize();
                function initialize() {
                    var mapOptions = {
                        center: new google.maps.LatLng(40.601203, -8.668173),
                        zoom: 9,
                        mapTypeId: 'roadmap',
                    };
                    //console.log("reached");
                    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                    // a new Info Window is created
                    infoWindow = new google.maps.InfoWindow();

                    // Event that closes the Info Window with a click on the map
                    google.maps.event.addListener(map, 'click', function () {
                        infoWindow.close();
                    });

                    // Finally displayMarkers() function is called to begin the markers creation
                    displayMarkers();
                }

                google.maps.event.addDomListener(window, 'load', initialize);


                // This function will iterate over markersData array
                // creating markers with createMarker function
                function displayMarkers() {
                    //console.log("reached");
                    // this variable sets the map bounds according to markers position
                    var bounds = new google.maps.LatLngBounds();
                    //console.log("valid = " + valid_property1);
                    // for loop traverses markersData array calling createMarker function for each marker
                    var i;
                    for (i = 0; i < valid_property1.length; i++) {
                        console.log("reached");
                        console.log("valid = " + valid_property1[i].coordinates.x);
                        var x = Number(valid_property1[i].coordinates.x);
                        var y = Number(valid_property1[i].coordinates.y);
                        var latlng = new google.maps.LatLng(x, y);
                        console.log("entered description = " + ((valid_property1[i].description)));
                        var name = valid_property1[i].description;
                        var address1 = valid_property1[i].address.city;
                        var address2 = valid_property1[i].address.state;
                        var postalCode = valid_property1[i].address.zipcode;

                        createMarker(latlng, name, address1, address2, postalCode);

                        // marker position is added to bounds variable
                        bounds.extend(latlng);
                    }

                    // Finally the bounds variable is used to set the map bounds
                    // with fitBounds() function
                    map.fitBounds(bounds);
                }

                // This function creates each marker and it sets their Info Window content
                function createMarker(latlng, name, address1, address2, postalCode) {
                    var marker = new google.maps.Marker({
                        map: map,
                        position: latlng,
                        title: name
                    });

                    // This event expects a click on a marker
                    // When this event is fired the Info Window content is created
                    // and the Info Window is opened.
                    google.maps.event.addListener(marker, 'click', function () {

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
            }
        });
    	$scope.searchByCity = function(){
        	//alert(1);
        	var whereTo = $scope.searchCity;
        	if(whereTo)
        	window.location.assign("/api/auth/home?c="+whereTo);
        	else
        		window.location.assign("/api/auth/home");	
        }

        })
        
        
        

        // markersData variable stores the information necessary to each marker



