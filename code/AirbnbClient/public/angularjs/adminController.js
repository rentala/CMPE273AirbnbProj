/**
 * Created by Tarshith Vishnu on 11/25/2016.
 */
var adminApp = angular.module('adminApp',[]);
adminApp.controller('adminController',function($scope,$http,$rootScope){
    $rootScope.showHostsByCity = false;

    $rootScope.showDashboard = false;
    $rootScope.showInbox = false;
    $rootScope.showBills = false;

    $rootScope.showTopProperties = false;
    $rootScope.showCityWiseRevenues = false;
    $rootScope.showTopHost = false;

    $rootScope.showPendingRequests = false;

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
        $rootScope.showDashboard = false;
        $rootScope.showInbox = false;
        $rootScope.showBills = false;
        $rootScope.showHostsByCity = true;
        console.log("reached");
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
});

adminApp.controller('adminHomeController', function($scope,$http,$rootScope){

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

        $rootScope.showDateInput = false;
        $rootScope.showMonthInput = false;
        $rootScope.showYearInput = false;
        $rootScope.showBillsButton = false;

        $rootScope.showBillsRequested = false;

        $scope.displayFields = function(){
            if($scope.refineCriteria == "date"){
                $rootScope.showDateInput = true;
                $rootScope.showMonthInput = false;
                $rootScope.showYearInput = false;
                $rootScope.showBillsButton = true;
            }
            if($scope.refineCriteria == "month"){
                $rootScope.showDateInput = false;
                $rootScope.showMonthInput = true;
                $rootScope.showYearInput = false;
                $rootScope.showBillsButton = true;
            }
            if($scope.refineCriteria == "year"){
                $rootScope.showDateInput = false;
                $rootScope.showMonthInput = false;
                $rootScope.showYearInput = true;
                $rootScope.showBillsButton = true;
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
                    $rootScope.showBillsRequested = true;
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
        $rootScope.showTopProperties = true;
        $rootScope.showCityWiseRevenues = false;
        $rootScope.showTopHost = false;
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

    $scope.getCityWiseRevenue = function(){
        $rootScope.showTopProperties = false;
        $rootScope.showCityWiseRevenues = true;
        $rootScope.showTopHost = false;

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

    $scope.getTopHost = function(){
        $rootScope.showTopProperties = false;
        $rootScope.showCityWiseRevenues = false;
        $rootScope.showTopHost = true;
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

