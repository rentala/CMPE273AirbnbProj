/**
 * Created by Rentala on 09-11-2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');


//Varsha..testing github
//Updated for comments
router.post('/updateProfile', function (req, res, next)  {
    var json_responses;
    var user_id = req.session.user_id;
   // var user_id = req.param("user_id");
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var email = req.param("email");
	var password = req.param("password");
	var Dob = req.param("Dob");
	var street = req.param("street");
	var aptNum = req.param("aptNum");
	var city = req.param("city");
	var state = req.param("state");
	var zipCode = req.param("zipCode");
	var phoneNumber = req.param("phoneNumber");            	
	var ssn = req.param("ssn");            	
	console.log("user updation", { email: email, firstName: firstName, lastName:lastName});
	
	
	var msg_payload = { "user_id":user_id, "email": email, "password": password, "firstName": firstName, "lastName": lastName,"Dob":Dob,"street":street,
			"aptNum":aptNum,"city":city,"state":state,"zipCode":zipCode,"phoneNumber":phoneNumber,"ssn":ssn};
	
	mq_client.make_request('update_profile_queue',msg_payload, function(err,results){
		if(err){
			return done(null, "error");
		}
		else 
		{
			if (results.code == 401){
                return done(null, false, req.flash('updateProfileMessage', 'Error updating profile'));
                json_responses = {
	                    "status_code" : results.code
	                };
			}
			else if(results.code == 200){
				json_responses = {
	                    "status_code" : results.code
	                };
			}
			else {    
				return done(null, "error");
			}
			res.send(json_responses);
	        res.end();
		}  
	});
});

router.get('/userDetails', function (req, res, next)  {
    var json_responses;
    var user_id = req.param("user_id");
	
	var msg_payload = { "user_id":user_id};
	
	mq_client.make_request('userinfo_queue',msg_payload, function(err,results){
		if(err){
			json_responses = {
                    "status_code" : results.code,
                    "userInfoMessage": "Error getting user info"
                };
		}
		else 
		{
			if (results.code == 400){
				json_responses = {
	                    "status_code" : results.code,
	                    "userInfoMessage": "Error getting user info"
	                };
			}
			else if(results.code == 200){
				var data = results.user;
				json_responses = {
	                    "status_code" : results.code,
	                    "user" : data
	                };
			}
			else {    
				json_responses = {
	                    "status_code" : results.code,
	                    "userInfoMessage": "Error getting user info"
	                };
			}
		} 
		 res.send(json_responses);
	        res.end();
	});
});

module.exports = router;
