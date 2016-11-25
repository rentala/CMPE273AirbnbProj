/**
 * Created by Rentala on 09-11-2016.
 */
var ejs = require("ejs");
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var tool = require("../utili/common");

var multer = require('multer');

//Varsha..testing github
//Updated for comments
router.post('/updateProfile', function (req, res, next)  {
    var json_responses;
    var user_id = req.session.user_id;
   // var user_id = req.param("user_id");
	var firstName = req.param("first_name");
	var lastName = req.param("last_name");
	var email = req.param("email");
	var Dob = req.param("dob");
	var street = req.param("street");
	var aptNum = req.param("aptNum");
	var city = req.param("city");
	var state = req.param("state");
	var zipCode = req.param("zipCode");
	var phoneNumber = req.param("phoneNumber");            	
	var ssn = req.param("ssn");            	
	console.log("user updation", { email: email, firstName: firstName, lastName:lastName});
	
	
	var msg_payload = { "user_id":user_id, "email": email, "firstName": firstName, "lastName": lastName,"Dob":Dob,"street":street,
			"aptNum":aptNum,"city":city,"state":state,"zipCode":zipCode,"phoneNumber":phoneNumber,"ssn":ssn};
	console.log("inside"+ msg_payload);
	mq_client.make_request('update_profile_queue',msg_payload, function(err,results){
		if(err){
			tool.logError(err);
			return done(null, "error");
		}
		else 
		{
			console.log("inside success");
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
			tool.logError(err);
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

router.post('/deleteUser', function (req, res, next)  {
    var json_responses;
    var user_id = req.param("user_id");
	           	
	var msg_payload = { "user_id":user_id};
	
	mq_client.make_request('delete_user_queue',msg_payload, function(err,results){
		if(err){
			return done(null, "error");
		}
		else 
		{
			if (results.code == 401){
                return done(null, false, req.flash('deleteUserMessage', 'Error deleting user'));
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

router.get('/editProfile', function (req, res, next)  {
	ejs.renderFile('./views/views/profile.ejs',{ user_dtls: req.session.user},function(err, result) {
		// render on success
		if (!err) {
		res.end(result);
		}
		// render or error
		else {
			tool.logError(err);
		res.end('An error occurred');
		console.log(err);
		}
		});
});

router.post('/loadProfile', function (req, res, next)  {
	var msg_payload = { "user_id":req.session.user_id};
	console.log("inside loadProfile");
	mq_client.make_request('reload_user_queue',msg_payload, function(err,results){
		if(err){
			return done(null, "error");
		}
		else 
		{
			if (results.code == 401){
                json_responses = {
	                    "status_code" : results.code
	                };
			}
			else if(results.code == 200){
				json_responses = {
	                    "status_code" : results.code
	                };
				req.session.user = results.value;
			}
			else {    
				return done(null, "error");
			}
			res.send({user:req.session.user});
	        res.end();
		}  
	});
	
	
	//res.send({user:req.session.user});
});


router.post('/uploadPic', function (req, res, next)  {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../AirbnbClient/public/uploads');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            imagePath = getID() + '.'
                + file.originalname.split('.')[file.originalname.split('.').length -1];
            console.log("imagePath"+imagePath);
            console.log("file.originalname"+ file.originalname);
            cb(null, imagePath);
        }
    });
    var upload = multer({ storage: storage}).array('file');
    var json_responses;
    upload(req,res,function(err) {
        if (err) {
      	  tool.logError(err);
            res.json({error_code: 1, err_desc: err});
            return;
        }
        var msg_payload = {"picture_path":req.files, "user_id" : req.session.user_id};

        mq_client.make_request('upload_pic_queue', msg_payload, function(err,results){
        	ejs.renderFile('./views/views/profile.ejs',{ user_dtls: req.session.user},function(err, result) {
        		if (!err) {
        		res.end(result);
        		}
        		// render or error
        		else {
        			tool.logError(err);
        		res.end('An error occurred');
        		console.log(err);
        		}
        		});
        });
    });

});
var getID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

router.get('/yourListings', function (req, res, next)  {
	ejs.renderFile('./views/views/yourListing.ejs',{ user_dtls: req.session.user},function(err, result) {
		// render on success
		if (!err) {
		res.end(result);
		}
		// render or error
		else {
			tool.logError(err);
		res.end('An error occurred');
		console.log(err);
		}
		});
});
router.get('/myTrips', function (req, res, next)  {
	ejs.renderFile('./views/views/trips.ejs',{ user_dtls: req.session.user},function(err, result) {
		if (!err) {
		res.end(result);
		}
		else {
			tool.logError(err);
		res.end('An error occurred');
		console.log(err);
		}
		});
});

module.exports = router;
