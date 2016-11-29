var myProfile = angular.module('myProfile',[]);
myProfile.controller('myProfileController',function($scope,$http){
    		
    		$http({
	            method:"POST",
	            url:"/api/profile/loadProfile"
	        }).success(function(data){
	        	$scope.data=data.user;
	        	$scope.first_name = data.user.first_name;
				$scope.last_name = data.user.last_name;
				$scope.phone = data.user.phone;
				$scope.email = data.user.email;
				$scope.street = data.user.street;
				$scope.dob = data.user.dob;
				$scope.aptNum = data.user.aptNum;
				$scope.city = data.user.city;
				$scope.state = data.user.state;
				$scope.zipCode = data.user.zipCode;
				$scope.ssn = data.user.ssn;
				$scope.image = data.user.picture_path[0].filename;
				$scope.video = data.user.video_path[0].filename;
	        })
    		
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
    		
    		/*$scope.uploadImg = function(){
    			$http({
    	            method:"POST",
    	            url:"/api/profile/uploadPic",
    	            data: {
        	        	"file":document.getElementById('file').files[0]
    	            }
    	        }).success(function(data){
    	        	$scope.data=data.user;
					$scope.msg = "Updated Successfully";
    	        })
    		}
			$scope.uploadvideo = function(){
				$http({
					method:"POST",
					url:"/api/profile/uploadvideo",
					data: {
						"file":document.getElementById('file').files[0]
					}
				}).success(function(data){
					$scope.data=data.user;
					$scope.msg = "Updated Successfully";
				})
			}*/
    		
    		$scope.submitProfile = function(){
    			$http({
    	            method:"POST",
    	            url:"/api/profile/updateProfile",
    	            data: {
        	        	"first_name":$scope.first_name,
        	        	"last_name": $scope.last_name,
        	        	"phoneNumber": $scope.phone 	,
        	        	"email": $scope.email 	,
        	        	"dob": $scope.dob ,
                        "street":$scope.street,
                        "aptNum":$scope.aptNum,
                        "city":$scope.city,
                        "state":$scope.state,
                        "zipCode":$scope.zipCode,
                        "ssn":$scope.ssn
    	            }
    	        }).success(function(data){
    	        	$scope.data=data.user;
					$scope.msg = "Updated Successfully";
    	        })
    		}
    	});