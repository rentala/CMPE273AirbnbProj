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

                var svgPropertyClicksDiv = d3.select('#propertyClicksDiv').select("svg");
                if(svgPropertyClicksDiv){ svgPropertyClicksDiv.remove();}

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
                    displayBar( $scope.prop_clicks_data,svg);
                }).error(function (data) {

                });

            };

            $scope.pageClicks = function () {

                var svgPageClicksDiv = d3.select('#pageClicksDiv').select("svg");
                if(svgPageClicksDiv){ svgPageClicksDiv.remove();}

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
                    displayBar( $scope.page_clicks_data,svg);
                }).error(function (data) {

                });
            };

            $scope.userTrace = function () {


                var tableUserTrace = d3.select('#userTraceDiv').select("table");
                if(tableUserTrace){ tableUserTrace.remove();}

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
            };


            $scope.biddingTrace = function(){

                var tableBiddingTrace = d3.select('#biddingTraceDiv').select("table");
                if(tableBiddingTrace ){ tableBiddingTrace.remove();}

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
                    var table = d3.select('#biddingTraceDiv') .append('table').attr("style", "margin-left: 200px").style("border", "2px black solid");
                    tabulate($scope.bid_trace_data, table,['Timestamp','User_Id','User_Name','Property_Id','Property_Name','Event']);
                });
            };

            /*var display2DGraph = function(data,svg){

                console.log("display graph");
                
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = +svg.attr("width") - margin.left - margin.right,
                    height = +svg.attr("height") - margin.top - margin.bottom,
                    barPadding = 2,
                    barWidth = (width / data.length) - barPadding;

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



            };*/

            var displayBar = function (data,svg) {

                console.log("inside displayBar : "+JSON.stringify(data));
                cast(data);
                main(data,svg);
            };

            function cast(d) {
                console.log("inside cast function");
                d.value = +d.value;
                return d;
            }

            function main(data,svg) {
                console.log("inside main function");
                setSize(data,svg);
            }

            function setSize(data,svg) {
                console.log("inside setsize function");
                var chartWidth, chartHeight;
                var width, height;
                var axisLayer = svg.append("g").classed("axisLayer", true);
                var chartLayer = svg.append("g").classed("chartLayer", true);
                var margin;
                var xScale = d3.scaleBand();
                var yScale = d3.scaleLinear();


                width = 600;
                height = 600;

                margin = {top: 0, left: 100, bottom: 40, right: 0};


                chartWidth = width - (margin.left + margin.right);
                chartHeight = height - (margin.top + margin.bottom);

                svg.attr("width", width).attr("height", height);

                axisLayer.attr("width", width).attr("height", height);

                chartLayer
                    .attr("width", chartWidth)
                    .attr("height", chartHeight)
                    .attr("transform", "translate(" + [margin.left, margin.top] + ")");


                xScale.domain(data.map(function (d) {
                    return d.key
                })).range([0, chartWidth])
                    .paddingInner(0.1)
                    .paddingOuter(0.5);

                yScale.domain([0, d3.max(data, function (d) {
                    return d.value
                })]).range([chartHeight, 0]);

                drawAxis(xScale,yScale,chartWidth,chartHeight,margin,axisLayer,chartLayer);
                drawChart(data,chartLayer,xScale,yScale,chartHeight);

            }

            function drawChart(data,chartLayer,xScale,yScale,chartHeight) {

                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        return "<strong>"+ d.key +":</strong> <span style='color:#708cff'>" + d.value + " Clicks</span>";
                    });

                chartLayer.call(tip);

                var t = d3.transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .on("start", function (d) {
                        console.log("transiton start")
                    })
                    .on("end", function (d) {
                        console.log("transiton end")
                    });

                var bar = chartLayer.selectAll(".bar").data(data);

                bar.exit().remove();

                bar.enter().append("rect").classed("bar", true)
                    .merge(bar)
                    .attr("fill", function (d, i) {
                        return 'rgb(256, ' + Math.round(i / 8) + ', ' + i + ')'
                    })
                    .attr("width", xScale.bandwidth())
                    .attr("height", 0)
                    .attr("transform", function (d) {
                        return "translate(" + [xScale(d.key), chartHeight] + ")"
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);


                chartLayer.selectAll(".bar").transition(t)
                    .attr("height", function (d) {
                        return chartHeight - yScale(d.value)
                    })
                    .attr("transform", function (d) {
                        return "translate(" + [xScale(d.key), yScale(d.value)] + ")"
                    })
            }

            function drawAxis(xScale,yScale,chartWidth,chartHeight,margin,axisLayer,chartLayer) {
                var yAxis = d3.axisLeft(yScale)
                    .tickSizeInner(-chartWidth)

                axisLayer.append("g")
                    .attr("transform", "translate(" + [margin.left, margin.top] + ")")
                    .attr("class", "axis y")
                    .call(yAxis);

                chartLayer.append("text")
                    .attr("transform", "translate(" + (chartWidth/ 2) + " ," + (chartHeight + margin.bottom) + ")")
                    .style("text-anchor", "middle")
                    .text("Property Name");

                var xAxis = d3.axisBottom(xScale);

                axisLayer.append("g")
                    .attr("class", "axis x")
                    .attr("transform", "translate(" + [margin.left, chartHeight] + ")")
                    .call(xAxis);

                chartLayer.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x",0 - (chartHeight / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Clicks");
            }


                var tabulate = function(data,table, columns) {

                    var thead = table.append('thead');
                    var tbody = table.append('tbody');

                    // append the header row
                    thead.append('tr')
                        .selectAll('th')
                        .data(columns).enter()
                        .append('th')
                        .text(function (column) {
                            return column;
                        });

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
                        .text(function (d) {
                            return d.value;
                        });
                    return table;
                };

                $scope.searchByCity = function(){
                	//alert(1);
                	var whereTo = $scope.searchCity;
                	if(whereTo)
                	window.location.assign("/api/auth/home?c="+whereTo);
                	else
                		window.location.assign("/api/auth/home");	
                }
        });