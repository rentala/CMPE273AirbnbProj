/**
 * Created by Tarshith Vishnu on 11/25/2016.
 */
var adminApp = angular.module('adminApp',[]);
adminApp.controller('adminController',function($scope,$http,$rootScope){
    $rootScope.showHostsByCity = false;
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
                $('.modal-backdrop').remove();
                window.location = '/api/admin/adminHome';
            }
            else if(data.status_code=="400"){
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
    $rootScope.showDashboard = false;
    $rootScope.showInbox = false;
    $rootScope.showBills = false;

    $scope.showTopProperties = false;
    $scope.showCityWiseRevenues = false;
    $scope.showTopHost = false;

    $scope.showPendingRequests = false;

  /*  $scope.getProfile = function(host_id){
        console.log("reached getPRofiel = " + host_id);
        $http({
            method: "GET",
            url: "/api/admin/getUserDetailsForProfile/" + host_id
        })
    }*/

    $scope.dashboard = function(){
        console.log("reached");
        $rootScope.showDashboard = true;
        $rootScope.showInbox = false;
        $rootScope.showBills = false;
        $rootScope.showHostsByCity = false;
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
                    "host_status" : "NA",
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

        $scope.viewBill = function(billing_id, trip_id){
            window.open("/api/billing/viewBill?trip_id="+trip_id+"&bill_id="+billing_id,'Bill',directories=0);
        }
    }
//***************BILLS End here*****************

    $scope.getTopProperties = function(){
     
     console.log("Top Properties");
     
        $scope.showTopProperties = true;
        $scope.showCityWiseRevenues = false;
        $scope.showTopHost = false;
        //Delete the 'svg' tag if it exists
        var svgCityWiseRevenueDiv = d3.select('#cityWiseRevenueDiv').select("svg");
        if(svgCityWiseRevenueDiv){ svgCityWiseRevenueDiv.remove();}
        var svgTopHostDiv = d3.select('#topHostDiv').select("svg");
        if(svgTopHostDiv){ svgTopHostDiv.remove();}

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
                display2DGraph( $scope.topProperties,svg)
            }
            else if(data.status_code == 400){
                console.log("error on service side");
            }
            else if(data.status_code == 401){
                console.log("no data recieved");
            }
        })
    }

    $scope.getCityWiseRevenue = function(){
     
     console.log("City Wise Revenue");
        $scope.showTopProperties = false;
        $scope.showCityWiseRevenues = true;
        $scope.showTopHost = false;
        
        var svgTopPropertiesDiv = d3.select('#topPropertiesDiv').select("svg");
        if(svgTopPropertiesDiv){ svgTopPropertiesDiv.remove();}
        var svgTopHostDiv = d3.select('#topHostDiv').select("svg");
        if(svgTopHostDiv){ svgTopHostDiv.remove();}

        $scope.getCityRevenue = function(){
            //console.log($scope.cityForRevenue);
            $http({
                method : "POST",
                url : "/api/analytics/cityWiseData",
                data : {
                    //"city" : $scope.cityForRevenue
                    "city" : "San Jose"
                }
            }).success(function(data){
                if(data.status_code == 200){
                    $scope.cityWiseRevenue = data.city_wise_data;
                    var svg = d3.select('#cityWiseRevenueDiv') .append('svg') .attr('height', 200) .attr('width', 300);
                    display2DGraph( $scope.cityWiseRevenue,svg)
                }
                else if(data.status_code == 400){
                    console.log("error on service");
                }
                else if(data.status_code == 401){
                    console.log("no data received");
                }
            })
        }
    } 

    $scope.getTopHost = function(){
     
     console.log("Top Host");
        $scope.showTopProperties = false;
        $scope.showCityWiseRevenues = false;
        $scope.showTopHost = true;
        
        
        var svgTopPropertiesDiv = d3.select('#topPropertiesDiv').select("svg");
        if(svgTopPropertiesDiv){ svgTopPropertiesDiv.remove();}
        
        var svgCityWiseRevenueDiv = d3.select('#cityWiseRevenueDiv').select("svg");
        if(svgCityWiseRevenueDiv){ svgCityWiseRevenueDiv.remove();}
        
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
                display2DGraph( $scope.topHost,svg)
            }
            else if(data.status_code == 400){
                console.log("error on service");
            }
            else if(data.status_code == 401){
                console.log("no data received");
            }
        })
    }
    
    var display2DGraph = function(data,svg){
        
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
})

