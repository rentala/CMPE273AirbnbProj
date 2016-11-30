 var app = angular.module('myListing',[]);
        app.controller('myListingController',function($scope,$http){
            console.log("inside controller");
            $scope.showPropertyClicks = true;
            $scope.showPageClicks = false;
            $scope.showUserTrace = false;
            $scope.showBiddingTrace = false;

        	$http({
	            method:"GET",
	            url:"/api/property/myListings"
	        }).success(function(data){
	        	$scope.list =false;
	        	$scope.list1 = true;
	        	if(data.status_code == "200" ){
	        		$scope.list = false;
		        	$scope.list1 = true;
					$scope.user=data.user;
		        	$scope.data=data.records;
		        	console.log("dasdsada");
	        	}
	        	else{
	        		$scope.list = true;
	        		$scope.list1 = false;
	        		$scope.data=null;
					$scope.data=data.user;
	        	}
	        })

            $scope.propertyClicks = function () {
                $scope.showPropertyClicks = true;
                $scope.showPageClicks = false;
                $scope.showUserTrace = false;
                $scope.showBiddingTrace = false;

                $http({
                    method: "GET",
                    url: '/api/analytics/propertyClicks'
                }).success(function (data) {
                    $scope.prop_clicks_data = data;
                    console.log("prop lcicks data : " + $scope.prop_clicks_data );
                    var svg = d3.select('#propertyClicksDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                    display2DGraph( $scope.prop_clicks_data,svg);
                }).error(function (data) {

                });



            };

            $scope.pageClicks = function () {
                $scope.showPageClicks = true;
                $scope.showUserTrace = false;
                $scope.showBiddingTrace = false;
                $scope.showPropertyClicks = false;

                $http({
                    method: "GET",
                    url: '/api/analytics/pageClicks'
                }).success(function (data) {
                    $scope.page_clicks_data = data;
                    console.log("page clicks data : " + JSON.stringify($scope.page_clicks_data));
                    var svg = d3.select('#pageClicksDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                    display2DGraph( $scope.page_clicks_data,svg);
                }).error(function (data) {

                });
            };

            $scope.userTrace = function () {
                $scope.showUserTrace = true;
                $scope.showBiddingTrace = false;
                $scope.showPropertyClicks = false;
                $scope.showPageClicks = false;

                $http({
                    method: "GET",
                    url: '/api/analytics/userTrace'
                }).success(function (data) {
                    //checking the response data for statusCode

                    $scope.user_trace_data = data;
                    console.log("Bar chart data : " + JSON.stringify($scope.user_trace_data));
                    var table = d3.select('#userTraceDiv') .append('table');
                    tabulate($scope.user_trace_data, table,['Timestamp', 'User_id', 'Event']);
                });
            }


            $scope.biddingTrace = function(){
                $scope.showBiddingTrace = true;
                $scope.showPropertyClicks = false;
                $scope.showPageClicks = false;
                $scope.showUserTrace = false;


                $http({
                    method: "GET",
                    url: '/api/analytics/biddingTrace'
                }).success(function (data) {
                    //checking the response data for statusCode

                    $scope.bid_trace_data = data;
                    console.log("Bar chart data : " + JSON.stringify($scope.bid_trace_data));
                    var table = d3.select('#biddingTraceDiv') .append('table');
                    tabulate($scope.bid_trace_data, table,['Timestamp','User_id','User_Name','Property_Id','Property_Name','Event']);
                });
            };

            var display2DGraph = function(data,svg){

                console.log("display graph");
                //var data =$scope.dataForPropClicks;


                //var svg = d3.select('#propertyClicksDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = +svg.attr("width") - margin.left - margin.right,
                    height = +svg.attr("height") - margin.top - margin.bottom;

                /*var svg = d3.select("svg"),
                 margin = {top: 20, right: 20, bottom: 30, left: 40},
                 width = +svg.attr("width") - margin.left - margin.right,
                 height = +svg.attr("height") - margin.top - margin.bottom;*/

                var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
                    y = d3.scaleLinear().rangeRound([height, 0]);

                var g = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                x.domain(data.map(function(d) { return d.key; }));
                y.domain([0, d3.max(data, function(d) { return d.value; })]);

                g.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                g.append("g")
                    .attr("class", "axis axis--y")
                    .call(d3.axisLeft(y).ticks(10))
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("text-anchor", "end")
                    .text("Clicks");

                g.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.key); })
                    .attr("y", function(d) { return y(d.value); })
                    .attr("width", x.bandwidth())
                    .attr("height", function(d) { return height - y(d.value); });

            };

                var tabulate = function(data,table, columns) {

                    var thead = table.append('thead');
                    var	tbody = table.append('tbody');

                    // append the header row
                    thead.append('tr')
                        .selectAll('th')
                        .data(columns).enter()
                        .append('th')
                        .text(function (column) { return column; });

                    // create a row for each object in the data
                    var rows = tbody.selectAll('tr')
                        .data(data)
                        .enter()
                        .append('tr');

                    // create a cell in each row for each column
                    var cells = rows.selectAll('td')
                        .data(function (row) {
                            return columns.map(function (column) {
                                return {column: column, value: row[column]};
                            });
                        })
                        .enter()
                        .append('td')
                        .text(function (d) { return d.value; });
                    return table;
                }


        });