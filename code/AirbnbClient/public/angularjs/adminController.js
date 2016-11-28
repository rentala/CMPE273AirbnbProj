/**
 * Created by Tarshith Vishnu on 11/25/2016.
 */
var adminApp = angular.module('adminApp',[]);
adminApp.controller('adminController',function($scope,$http,$rootScope){

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
});

adminApp.controller('adminHomeController', function($scope,$http,$rootScope){
    $scope.showDashboard = false;
    $scope.showInbox = false;
    $scope.showBills = false;

    $scope.showTopProperties = false;
    $scope.showCityWiseRevenues = false;
    $scope.showTopHost = false;

    $scope.showPendingRequests = false;

    $scope.dashboard = function(){
        console.log("reached");
        $scope.showDashboard = true;
        $scope.showInbox = false;
        $scope.showBills = false;
    }

    $scope.inbox = function(){
        console.log("reached");
        $scope.showDashboard = false;
        $scope.showInbox = true;
        $scope.showBills = false;

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

    $scope.bills = function(){
        console.log("reached");
        $scope.showDashboard = false;
        $scope.showInbox = false;
        $scope.showBills = true;

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

    /*$scope.haha = function(){
        console.log(document.getElementById("year").value);
    }*/

    $scope.topProperties = function(){
        $scope.showTopProperties = true;
        $scope.showCityWiseRevenues = false;
        $scope.showTopHost = false;
        $http({
            method : "GET",
            url : "/api/analytics/topProp",
            data :{
                "no_of_props" : 10
            }
        }).success(function(data){
            if(data.status_code == 200){
                $scope.topProperties = data.top_property;
            }
            else if(data.status_code == 400){
                console.log("error on service side");
            }
            else if(data.status_code == 401){
                console.log("no data recieved");
            }
        })
    }

    $scope.cityWiseRevenue = function(){
        $scope.showTopProperties = false;
        $scope.showCityWiseRevenues = true;
        $scope.showTopHost = false;

        $scope.getCityRevenue = function(){
            //console.log($scope.cityForRevenue);
            $http({
                method : "GET",
                url : "/api/analytics/cityWiseData",
                data : {
                    "city" : $scope.cityForRevenue
                }
            }).success(function(data){
                if(data.status_code == 200){
                    $scope.cityWiseRevenue = data.city_wise_data;
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

    $scope.topHost = function(){
        $scope.showTopProperties = false;
        $scope.showCityWiseRevenues = false;
        $scope.showTopHost = true;
        $http({
            method : "GET",
            url : "/api/analytics/topHost",
            data : {
                "no_of_hosts" : 2
            }
        }).success(function(data){
            if(data.status_code == 200){
                $scope.topHost = data.data;
            }
            else if(data.status_code == 400){
                console.log("error on service");
            }
            else if(data.status_code == 401){
                console.log("no data received");
            }
        })
    }
})

