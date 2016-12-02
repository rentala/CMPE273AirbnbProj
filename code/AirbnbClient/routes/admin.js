var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var passport = require('passport');
var tool = require("../utili/common");
//POST method to approve host...making changes in this admin file...anudeep
router.post('/approveHost', function (req, res)  {
    
	console.log("Request Data  : " + JSON.stringify(req.body));
	
	var host_id = req.body.host_id;

	console.log("In AirbnbClient : admin.js : approveHost: Host_ID :"+ host_id);
	
	var msg_payload = { "host_id" : host_id };
	
	mq_client.make_request('approve_host_queue',msg_payload, function(err,results){
		if(err){
			tool.logError(err);
			var json_resp = {
					"status_code" : 400 
			};
			res.send(json_resp);
			res.end();
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
	
	var city = req.body.city;
	
	var host_status = req.body.host_status;

	console.log("In AirbnbClient : admin.js :pendingHostsForApproval: city :"+ city);
	
	var msg_payload = { "city" : city , "host_status" : host_status };
	
	mq_client.make_request('pending_hosts_for_approval_queue',msg_payload, function(err,results){
		if(err){
			tool.logError(err);
			var json_resp = {
					"status_code" : 400 
			};
			res.send(json_resp);
			res.end();
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
	var json_responses;
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

router.get('/adminLogin', function(req, res){
	console.log("reached admin login");
	res.render('admin/adminlogin');
});

router.get('/adminHome', function(req, res){
	if(req.session.admin)
		res.render('admin/adminHome');
	else
		res.redirect('/');
});

router.post('/adminLogOut',function(req, res){
	console.log("reached here");
	req.session.destroy();
	res.send({
		"status_code" : 200
	})
});

router.post('/getAllBills',function (req,res) {
	var json_responses;
	var date = req.body.date;
	date = new Date(date);
	console.log("month = " + date.getMonth());
	var msg_payload = {
		"refineCriteria" : req.body.refineCriteria,
		"date" : date,
		"month" :new Date(req.body.month),
		"year" :req.body.year
	};

	mq_client.make_request('get_admin_bills_queue',msg_payload,function (err,results) {
        if(err){
            tool.logError(err);
            var json_responses = {
                "status_code" : 400
            };
        }
        else {
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"bills":results.bills};
            }
            else {
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
	});
});

router.get('/getUserDetailsForProfile/:user_id', function(req, res, next){
	var user_id = req.param("user_id");
	console.log("the user id:"+user_id);
	var msg_payload = {
		"user_id" : user_id
	}
	
	mq_client.make_request('getUserDetails_queue',msg_payload, function(err,results){
		if(err){
			tool.logError(err);
			json_responses = {
				"status_code" : 400 
			};
		}
		else{
			if(results.code == "400"){
				json_responses = {
					"status_code" : 400
				};
			}
			else if(results.code == "200"){
				console.log("reached else");
				res.render('./views/userProfile.ejs', {userDetails: results.user,userPropertyDetails:results.properties});
			}
		}  
		
	});
})

//End of admin routes.
//One more comment.
module.exports = router;
