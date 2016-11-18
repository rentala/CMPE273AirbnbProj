var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var passport = require('passport');


//POST method to approve a host for listing properties on Airbnb....testing 2
router.post('/approveHost', function (req, res)  {
    
	console.log("Request Data  : " + JSON.stringify(req.body));
	
	var host_id = req.param("host_id");

	console.log("In AirbnbClient : admin.js : approveHost: Host_ID :"+ host_id);
	
	var msg_payload = { "host_id" : host_id };
	
	mq_client.make_request('approve_host_queue',msg_payload, function(err,results){
		if(err){
			//TODO : Need to handle error
		}
		else{
			
			res.send(results.json_resp);
			res.end();
		}  
	});
});

//POST method for getting pending host approval request


router.post('/pendingHostsForApproval', function (req, res)  {
   
	console.log("Request Data  : " + JSON.stringify(req.body));
	
	var city = req.param("city");
	
	var host_status = req.param("host_status");

	console.log("In AirbnbClient : admin.js :pendingHostsForApproval: city :"+ city);
	
	var msg_payload = { "city" : city , "host_status" : host_status };
	
	mq_client.make_request('pending_hosts_for_approval_queue',msg_payload, function(err,results){
		if(err){
			//TODO : Need to handle error
		}
		else{
			
			res.send(results.json_resp);
			res.end();
		}  
	});
});

router.post('/adminCheckLogin', function(req, res, next){
	var email = req.body.username;
	var password = req.body.password;
	console.log("email = " + email + " password = " + password);
	passport.authenticate('adminLoginRequest', function(err, admin, info) {
	    if(err) {
	      return next(err);
	    }
	    if(!admin) {
	    	return res.send({
	    		"status_code" : 400
	    	});
	    }
	    else{
		    req.logIn(admin, {session:false}, function(err) {
	            if(err) {
	            return next(err);
	            }
	            req.session.admin = admin.adminEmailId;
	            console.log("session initialized = " + req.session.admin);
	            return res.send({
	            	"status_code" : 200
	            });
		    });
		}
	})(req, res, next);
});
//End of admin routes.
//One more comment.
module.exports = router;
