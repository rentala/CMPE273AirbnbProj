/**
 * Created by Tarshith Vishnu on 11/25/2016.
 */
var adminApp = angular.module('adminApp',[]);
adminApp.controller('adminController',function($scope,$http,$rootScope){
    $rootScope.showHostsByCity = false;
    $rootScope.showDashboard = true;
    $rootScope.showInbox = false;
    $rootScope.showBills = false;
    $rootScope.showError = false;

    $scope.logIn = function(){
        $http({
            method:"POST",
            url:"/api/admin/adminCheckLogin",
            data:{
                "username":$scope.emailAddress,
                "password":$scope.password
            }
        }).success(function(data){
            if(data.status_code=="200"){
                $rootScope.adminDetails = data.adminDetails;
                console.log("admin details = " + $rootScope.adminDetails[0].first_name);
                $('.modal-backdrop').remove();
                window.location = '/api/admin/adminHome';

            }
            else{
                $scope.loginError="Wrong email address or password";
            }
        })
    }

    $scope.logOut = function(){
        $http({
            method:"POST",
            url:"/api/admin/adminLogOut"
        }).success(function(data){
            if(data.status_code = 200){
                window.location = '/';
            }
            else{
                console.log("Failed Log Out");
            }
        })
    }

    $scope.getHostsByCity = function(){
        $rootScope.showHostsByCity = true;
        $rootScope.showDashboard = false;
        $rootScope.showInbox = false;
        $rootScope.showBills = false;
        $http({
            method : "POST",
            url : "/host/getHostByCity",
            data : {
                "city" : $scope.cityToSearchHost
            }
        }).success(function(data){
            if(data.status_code == 200){
                $scope.hostsByCity = data.host_dtls;
            }
        })
    }

    $scope.deleteHost = function(host_id){
        $http({
            method : "POST",
            url : "/host/delete",
            data : {
                "host_id" : host_id
            }
        }).success(function(data){
            if(data.status_code == 200){
                $scope.getHostsByCity();
            }
            else{
                console.log("error in deleting host");
            }
        })
    }
});

adminApp.controller('adminHomeController', function($scope,$http,$rootScope){

    $rootScope.showHostsByCity = false;
    $rootScope.showDashboard = true;
    $rootScope.showInbox = false;
    $rootScope.showBills = false;

    $scope.showTopProperties = false;
    $scope.showCityWiseRevenues = false;
    $scope.showTopHost = false;

    $scope.showPendingRequests = false;

    $scope.dashboard = function(){
        //console.log("admin details = " + $rootScope.adminDetails[0].first_name);
        console.log("reached");
        $rootScope.showDashboard = true;
        $rootScope.showInbox = false;
        $rootScope.showBills = false;
        $rootScope.showHostsByCity = false;

        $scope.showTopProperties = true;
        $scope.showCityWiseRevenues = false;
        $scope.showTopHost = false;

        $http({
            method : "POST",
            url : "/api/analytics/topProp",
            data :{
                "no_of_props" : 10,
                "year" : "2016"
            }
        }).success(function(data){
          console.log("Top Properites controller : " + JSON.stringify(data));
            if(data.status_code == 200){
                $scope.topProperties = data.top_property;
                console.log("Angular Top Properties : " + JSON.stringify($scope.topProperties) );
                var svg = d3.select('#topPropertiesDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                displayBar( $scope.topProperties,svg,"Property Name","Revenue")
            }
            else if(data.status_code == 400){
                console.log("error on service side");
            }
            else if(data.status_code == 401){
                $rootScope.showError = true;
                console.log("no data recieved");
            }
        })

    }


//****************INBOX Begins Here***********
    $scope.inbox = function(){
        console.log("reached");
        $rootScope.showDashboard = false;
        $rootScope.showInbox = true;
        $rootScope.showBills = false;
        $rootScope.showHostsByCity = false;

        $scope.getPendingHostAppovals = function(){
            $http({
                method : "POST",
                url : "/api/admin/pendingHostsForApproval",
                data : {
                    "host_status" : "REQUESTED",
                    "city" : $scope.cityForInbox
                }
            }).success(function(data){
                if(data.status_code == 200){
                    console.log("data = " + JSON.stringify(data));
                    $scope.showPendingRequests = true;
                    $scope.userDetails = data.userDtls;
                }
                else if(data.status_code == 400){
                    console.log("error on service side");
                }
                else if(data.status_code == 401){
                    console.log("no data recieved");
                }
            })
        }

        $scope.approveHost = function(host_id){
            console.log(host_id);
            $http({
                method : "POST",
                url : "/api/admin/approveHost",
                data : {
                    "host_id" : host_id
                }
            }).success(function(data){
                if(data.status_code == 200){
                    $scope.getPendingHostAppovals();
                }
                else if(data.status_code == 400){
                    console.log("error on service side");
                }
                else if(data.status_code == 401){
                    console.log("no error but record was not updated");
                }
            })
        }

        $scope.rejectHost = function(host_id){
            console.log(host_id);
            $http({
                method : "POST",
                url : "/api/admin/rejectHost",
                data : {
                    "host_id" : host_id
                }
            }).success(function(data){
                if(data.status_code == 200){
                    $scope.getPendingHostAppovals();
                }
                else if(data.status_code == 400){
                    console.log("error on service side");
                }
                else if(data.status_code == 401){
                    console.log("no error but record was not updated");
                }
            })
        }
    }



////****************INBOX Ends Here***********


//***************BILLS Begins here*****************
    $scope.bills = function(){
        console.log("reached");
        $rootScope.showDashboard = false;
        $rootScope.showInbox = false;
        $rootScope.showBills = true;
        $rootScope.showHostsByCity = false;

        $scope.showDateInput = false;
        $scope.showMonthInput = false;
        $scope.showYearInput = false;
        $scope.showBillsButton = false;

        $scope.showBillsRequested = false;

        $scope.displayFields = function(){
            if($scope.refineCriteria == "date"){
                $scope.showDateInput = true;
                $scope.showMonthInput = false;
                $scope.showYearInput = false;
                $scope.showBillsButton = true;
            }
            if($scope.refineCriteria == "month"){
                $scope.showDateInput = false;
                $scope.showMonthInput = true;
                $scope.showYearInput = false;
                $scope.showBillsButton = true;
            }
            if($scope.refineCriteria == "year"){
                $scope.showDateInput = false;
                $scope.showMonthInput = false;
                $scope.showYearInput = true;
                $scope.showBillsButton = true;
            }
        }
        
        $scope.getBills = function(){
            var date = $scope.date;
            //console.log("month = " + typeof(date));
            //console.log("date in ISO = " + date.toISOString().split('T')[0]);
            var month = $scope.month;
            var year = document.getElementById("year").value;
            console.log("date = " + date + " month = " + month + " year = " + year);
            $http({
                method : "POST",
                url: "/api/admin/getAllBills",
                data: {
                    "refineCriteria" : $scope.refineCriteria,
                    "date" : date,
                    "month" : month,
                    "year" : year
                }
            }).success(function(data){
                if(data.status_code == 200){
                    $scope.showBillsRequested = true;
                    $scope.retreivedBills = data.bills;
                }
                else if(data.status_code == 400){
                    console.log("error on service side");
                }
                else if(data.status_code == 401){
                    $scope.retreivedBills = data.bills;
                    console.log("NO data received");
                }
            })
        }

        $scope.deleteBill = function(billing_id){
            console.log("billing id = " + billing_id);
            $http({
                method : "POST",
                url : "/api/billing/deleteBill",
                data : {
                    "billing_id" : billing_id
                }
            }).success(function(data){
                if(data.status_code == 200){
                    $scope.getBills();
                }
                else if(data.status_code == 400){
                    console.log("error on service side");
                }
                else if(data.status_code == 401){
                    console.log("no error but record was not updated");
                }
            })
        }

        $scope.viewBill = function(billing_id, trip_id, guest_name){
            //window.open("/api/billing/viewBill?trip_id="+trip_id+"&bill_id="+billing_id,'Bill',directories=0);
            window.open("/api/billing/viewBill1?trip_id="+trip_id+"&bill_id="+billing_id+"&guest_name="+guest_name,'Bill',directories=0);
        }
    }
//***************BILLS End here*****************

    $scope.getTopProperties = function(){
     
     console.log("Top Properties");
     $rootScope.showError = false;
     
        $scope.showTopProperties = true;
        $scope.showCityWiseRevenues = false;
        $scope.showTopHost = false;
        //Delete the 'svg' tag if it exists

        var svgTopPropertiesDiv = d3.select('#topPropertiesDiv').select("svg");
        if(svgTopPropertiesDiv){ svgTopPropertiesDiv.remove();}

        $http({
            method : "POST",
            url : "/api/analytics/topProp",
            data :{
                "no_of_props" : 10,
                "year" : "2016"
            }
        }).success(function(data){
          console.log("Top Properites controller : " + JSON.stringify(data));
            if(data.status_code == 200){
                $scope.topProperties = data.top_property;
                console.log("Angular Top Properties : " + JSON.stringify($scope.topProperties) );
                var svg = d3.select('#topPropertiesDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                displayBar( $scope.topProperties,svg,"Property Name","Revenue")
            }
            else if(data.status_code == 400){
                console.log("error on service side");
            }
            else if(data.status_code == 401){
                $rootScope.showError = true;
                console.log("no data recieved");
            }
        })
    }

    $scope.getCityWiseRevenue = function(){
        $rootScope.showError = false;
     
     console.log("City Wise Revenue");
        $scope.showTopProperties = false;
        $scope.showCityWiseRevenues = true;
        $scope.showTopHost = false;
        

        var svgCityWiseRevenueDiv = d3.select('#cityWiseRevenueDiv').select("svg");
        if(svgCityWiseRevenueDiv){ svgCityWiseRevenueDiv.remove();}

        $scope.getCityRevenue = function(){
            //console.log($scope.cityForRevenue);
            $http({
                method : "POST",
                url : "/api/analytics/cityWiseData",
                data : {
                    //"city" : $scope.cityForRevenue
                    "city" : $scope.cityForRevenue
                }
            }).success(function(data){
                if(data.status_code == 200){
                    $scope.cityWiseRevenue = data.city_wise_data;
                    var svg = d3.select('#cityWiseRevenueDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                    displayBar( $scope.cityWiseRevenue,svg,"City","Revenue");
                }
                else if(data.status_code == 400){
                    console.log("error on service");
                }
                else if(data.status_code == 401){
                    $rootScope.showError = true;
                    console.log("no data received");
                }
            })
        }
    } 

    $scope.getTopHost = function(){
     $rootScope.showError = false;
     console.log("Top Host");
        $scope.showTopProperties = false;
        $scope.showCityWiseRevenues = false;
        $scope.showTopHost = true;
        
        


        var svgTopHostDiv = d3.select('#topHostDiv').select("svg");
        if(svgTopHostDiv){ svgTopHostDiv.remove();}
        
        $http({
            method : "POST",
            url : "/api/analytics/topHost",
            data : {
                "no_of_hosts" : 2
            }
        }).success(function(data){
            if(data.status_code == 200){
                $scope.topHost = data.top_host;
                var svg = d3.select('#topHostDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                displayBar( $scope.topHost,svg,"Host Name","Revenue")
            }
            else if(data.status_code == 400){
                console.log("error on service");
            }
            else if(data.status_code == 401){
                $rootScope.showError = true;
                console.log("no data received");
            }
        })
    };

    $scope.dashboard();
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
                return "<strong>"+ d.key +":</strong> <span style='color:#708cff'>$" + d.value + "</span>";
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
});