 var app = angular.module('myListing',[]);
        app.controller('myListingController',function($scope,$http){
            console.log("inside controller");
            $scope.showPropertyClicks = true;
            $scope.showPageClicks = false;
            $scope.showUserTrace = false;
            $scope.showBiddingTrace = false;
            $scope.showError = false;


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
	        });

            $http({
                method: "GET",
                url: '/api/analytics/propertyClicks'
            }).success(function (data) {
                if(data.status_code==200){
                    if(data.finalData.length>0) {
                        $scope.prop_clicks_data = data.finalData;
                        console.log("prop lcicks data : " + $scope.prop_clicks_data);
                        var svg = d3.select('#propertyClicksDiv').append('svg').attr('height', 200).attr('width', 600);
                        displayBar($scope.prop_clicks_data, svg, "Property Name", "Clicks");
                    }
                    else{
                        console.log("no log entries yet!");
                        $scope.showError = true;
                    }
                }
                else {
                    console.log("no log entries yet!");
                    $scope.showError = true;
                }
            }).error(function (data) {

            });

            $scope.propertyClicks = function () {

                var svgPropertyClicksDiv = d3.select('#propertyClicksDiv').select("svg");
                if(svgPropertyClicksDiv){ svgPropertyClicksDiv.remove();}

                $scope.showPropertyClicks = true;
                $scope.showPageClicks = false;
                $scope.showUserTrace = false;
                $scope.showBiddingTrace = false;
                $scope.showPropertyRatings=false;
                $scope.showError = false;

                $http({
                    method: "GET",
                    url: '/api/analytics/propertyClicks'
                }).success(function (data) {
                    if(data.status_code==200){
                        if(data.finalData.length>0) {
                            $scope.prop_clicks_data = data.finalData;
                            console.log("prop lcicks data : " + $scope.prop_clicks_data);
                            var svg = d3.select('#propertyClicksDiv').append('svg').attr('height', 200).attr('width', 600);
                            displayBar($scope.prop_clicks_data, svg, "Property Name", "Clicks");
                        }
                        else{
                            console.log("no log entries yet!");
                            $scope.showError = true;
                        }
                    }
                    else {
                        console.log("no log entries yet!");
                        $scope.showError = true;
                    }
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
                $scope.showPropertyRatings=false;
                $scope.showError = false;
                var leastSeenPageArray = [];
                $http({
                    method: "GET",
                    url: '/api/analytics/pageClicks'
                }).success(function (data) {
                    if(data.status_code==200){
                        if(data.finalData.length>0)
                        {
                            var minimum = data.finalData[0].value;
                            for(var i = 0; i < data.finalData.length; i++){
                                if(data.finalData[i].value < minimum){
                                    minimum = data.finalData[i].value;
                                    leastSeenPageArray[0] = data.finalData[i].key;
                                }
                                console.log("minimum = " + minimum + JSON.stringify(leastSeenPageArray));
                            }
                            $scope.leastSeenPage = leastSeenPageArray;
                            $scope.page_clicks_data = data.finalData;
                            console.log("page clicks data : " + JSON.stringify($scope.page_clicks_data));
                            var svg = d3.select('#pageClicksDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                            displayBar( $scope.page_clicks_data,svg,"Page URL","Clicks");
                        }
                        else {
                            console.log("no log entries yet!");
                            $scope.showError = true;
                        }
                    }
                    else {
                        console.log("no log entries yet!");
                        $scope.showError = true;
                    }
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
                $scope.showPropertyRatings=false;
                $scope.showError = false;

                $http({
                    method: "GET",
                    url: '/api/analytics/userTrace'
                }).success(function (data) {
                    //checking the response data for statusCode

                    $scope.user_trace_data = data;
                    console.log("Bar chart data : " + JSON.stringify($scope.user_trace_data));
                    var svg = d3.select('#userTraceDiv').append('svg');
                    timeline($scope.user_trace_data,svg);
                });
            };


            $scope.biddingTrace = function(){

                var tableBiddingTrace = d3.select('#biddingTraceDiv').select("svg");
                if(tableBiddingTrace ){ tableBiddingTrace.remove();}

                $scope.showBiddingTrace = true;
                $scope.showPropertyClicks = false;
                $scope.showPageClicks = false;
                $scope.showUserTrace = false;
                $scope.showPropertyRatings=false;
                $scope.showError = false;
                
                
                console.log("Getting the bidding trace data !!");

                $http({
                    method: "GET",
                    url: '/api/analytics/biddingTrace'
                }).success(function (data) {
                    //checking the response data for statusCode
                    console.log("Bidding trace : data : " + JSON.stringify(data));
                    $scope.bid_trace_data = data;
                    console.log("Bar chart data : " + JSON.stringify($scope.bid_trace_data));
                    var svg = d3.select('#biddingTraceDiv').append('svg');
                    timeline($scope.bid_trace_data, svg);
                });
            };

            $scope.propertyRatings = function () {

                    var propertyRatingTrace = d3.select('#propertyRatingDiv').select("svg");
                    if(propertyRatingTrace ){ propertyRatingTrace.remove();}

                $scope.showBiddingTrace = false;
                    $scope.showPropertyClicks = false;
                    $scope.showPageClicks = false;
                    $scope.showUserTrace = false;
                    $scope.showPropertyRatings=true;
                    $scope.showError = false;

                    $http({
                        method: "GET",
                        url: '/api/analytics/propRatings'
                    }).success(function (data) {
                        //checking the response data for statusCode
                        console.log(data);
                        if(data.status_code == 200){
                            if(data.property_ratings_dtls.length > 0){
                                $scope.prop_ratings_data = data.property_ratings_dtls;
                                console.log("Bar chart data : " + JSON.stringify($scope.prop_ratings_data));
                                var svg = d3.select('#propertyRatingDiv').append('svg');
                                displayBar( $scope.prop_ratings_data,svg,"Property","Ratings");
                            }
                            else{
                                console.log("no matching data");
                                $scope.showError=true;    
                            }
                        }
                        else{
                            console.log("no matching data");
                            $scope.showError=true;
                        }

                    });
            };

            var displayBar = function (data,svg,xname,yname) {
                console.log("X name"+xname);
                console.log("Y name"+yname);
                console.log("inside displayBar : "+JSON.stringify(data));
                cast(data);
                main(data,svg,xname,yname);
            };

            function cast(d) {
                console.log("inside cast function");
                d.value = +d.value;
                return d;
            }

            function main(data,svg,xname,yname) {
                console.log("inside main function");
                console.log("X name"+xname);
                console.log("Y name"+yname);
                setSize(data,svg,xname,yname);
            }

            function setSize(data,svg,xname,yname) {

                console.log("X name"+xname);
                console.log("Y name"+yname);
                console.log("inside setsize function");
                console.log(data);
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

                drawAxis(xScale,yScale,chartWidth,chartHeight,margin,axisLayer,chartLayer,xname,yname);
                drawChart(data,chartLayer,xScale,yScale,chartHeight,yname);

            }

            function drawChart(data,chartLayer,xScale,yScale,chartHeight,yname) {

                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        return "<strong>"+ d.key +":</strong> <span style='color:#708cff'>" + d.value + "</span>";
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

            function drawAxis(xScale,yScale,chartWidth,chartHeight,margin,axisLayer,chartLayer,xname,yname) {
                var yAxis = d3.axisLeft(yScale)
                    .tickSizeInner(-chartWidth)

                axisLayer.append("g")
                    .attr("transform", "translate(" + [margin.left, margin.top] + ")")
                    .attr("class", "axis y")
                    .call(yAxis);

                chartLayer.append("text")
                    .attr("transform", "translate(" + (chartWidth/ 2) + " ," + (chartHeight + margin.bottom) + ")")
                    .style("text-anchor", "middle")
                    .text(xname);

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
                    .text(yname);
            }

            var timeline = function(data,svg){

                var margin = {top: 20, right: 20, bottom: 30, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

// parse the date / time
                var parseTime = d3.timeParse("%d-%b-%y");
                var formatTime = d3.timeFormat("%e %B");

// set the ranges
                var x = d3.scaleTime().range([0, width]);
                var y = d3.scaleLinear().range([height, 0]);

// define the line
                var valueline = d3.line()
                    .x(function(d) { return x(d.Timestamp); })
                    .y(function(d) { return 0; });

                svg = svg
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                console.log("after data : "+ JSON.stringify(data));

                // format the data
                data.forEach(function(d) {
                    d.Timestamp = new Date(d.Timestamp);
                    d.property_name  = d.property_name;
                    d.clicks = d.clicks;
                });

                console.log("after forEach : "+ JSON.stringify(data));

                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        return "<strong>"+ d.user_name +":</strong> <span style='color:#708cff'>" + d.Event + "</span>";
                    });

                svg.call(tip);

                // Scale the range of the data
                x.domain(d3.extent(data, function(d) { return d.Timestamp; }));
                //y.domain([0, d3.max(data, function(d) { return d.Event; })]);


                // Add the valueline path.
                svg.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline);

                // Add the scatterplot
                svg.selectAll("dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", 5)
                    .attr("cx", function(d,i) { return x(d.Timestamp); })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                // Add the X Axis
                svg.append("g")
                    .attr("transform", "translate(0," + height/8 + ")")
                    .call(d3.axisBottom(x));
            };







            /*var tabulate = function(data,table, columns) {

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
            };*/

                $scope.searchByCity = function(){
                	//alert(1);
                	var whereTo = $scope.searchCity;
                	if(whereTo)
                	window.location.assign("/api/auth/home?c="+whereTo);
                	else
                		window.location.assign("/api/auth/home");
                }
        });