var myProfile = angular.module('myProfile',[]);
    	myProfile.controller('myProfileController',function($scope,$http){
    		$scope.card1=true;
    		$scope.card=false;
    		$scope.profile = function(){
    			$scope.card=false;
    			$scope.card1=true;
    		}
    		$scope.profileImage = function(){
    			$scope.card1=false;
    			$scope.card=true;
    			
    		}
    		
    			$http({
    	            method:"POST",
    	            url:"/api/profile/loadProfile"
    	        }).success(function(data){
    	        	$scope.data=data.user;
    	        	$scope.first_name = data.user.first_name;
					$scope.last_name = data.user.last_name;
					$scope.phone = data.user.phone;
					$scope.email = data.user.email;
					$scope.dob = data.user.dob;
    	        	alert(data.user);
    	        })
    			

    	});