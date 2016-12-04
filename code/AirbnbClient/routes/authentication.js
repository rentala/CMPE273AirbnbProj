/**
 * Created by Rentala on 09-11-2016.
 */

var ejs = require("ejs");
var express = require('express');
var router = express.Router();
var passport = require('passport');
var tool = require("../utili/common");
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/airbnb";

router.post('/signInUser', function (req, res, next)  {
    var json_responses;
    passport.authenticate('login', function (err, user, info) {
        if(err){
      	   tool.logError(err);
            return next(err);
        }
        if(!user){
            json_responses = {"status_code":400};
        } else{
            req.logIn(user,{session:false}, function(err) {
                if(err) {
                    return next(err);
                }

                console.log("Got the user"+user._id);
                req.session.user = user;
                req.session.user_id = user._id;
                
                json_responses = {
                    "status_code" : 200,
                    "user" : JSON.stringify(user)
                };
                //return res.redirect('/');
            })
        }
        res.send(json_responses);
        res.end();
    })(req, res, next);

});

router.get('/test', function (req, res, next)  {
    var json_responses;
    json_responses = {
        "status_code" : 200,
        "user" : "test"
    };
    //return res.redirect('/');
    res.send(json_responses);
    res.end();
});

router.post('/signUpUser', function (req, res, next)  {
    var json_responses;
    console.log("inside signUpUser");
    var zipcode = req.param("zipCode");
    var ssn = req.param("ssn");            	
    var zipPatt = new RegExp("^[0-9]{5}(-[0-9]{4})?$");
    var validZip = zipPatt.test(zipcode);	
    
    var ssnPatt = new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{3}$");
    var validSSN = ssnPatt.test(ssn);
    if(!validZip){
    	json_responses = {
                "status_code" : 402,
                "error":"invalid Zip"
            };
    	res.send(json_responses);
        res.end();
    }
    else if(!validSSN){
    	json_responses = {
                "status_code" : 403,
                "error":"invalid SSN"
            };
    	res.send(json_responses);
        res.end();
    }
    else{
    passport.authenticate('signup', function (err, user, info) {
        if(err){
      	  tool.logError(err);
            return next(err);
        }
        if(!user){
            json_responses={"status_code":400};
        } else{
            req.logIn(user,{session:false}, function(err) {
                if(err) {
               	 tool.logError(err);
                    return next(err);
                }

                console.log("Got the user22" + JSON.stringify(user));
                //req.session.user = user;

                json_responses = {
                    "status_code" : 200,
                    "user" : JSON.stringify(user)
                };
                //return res.redirect('/');
            })
        }
        res.send(json_responses);
        res.end();
    })(req, res, next);
    }
});

router.get('/home', function (req, res, next)  {
	if(req.param("c")){
		ejs.renderFile('./views/views/home.ejs',{ user_dtls: req.session.user,city:req.param("c")},function(err, result) {
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
	}
	else{
	ejs.renderFile('./views/views/home.ejs',{ user_dtls: req.session.user},function(err, result) {
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
	}
});



router.get('/logout', function (req, res, next)  {
	req.session.destroy();
	res.redirect('/');
});


/*router.post('/testAdd1000Users', function(req, res, next){

    var email = "user1@gmail.com";
    var password = "1111";
    var first_name = "userFirstname1";
    var last_name = "userLastname1";
    var dob = "2016-12-04";
    var street = "1334, The Alameda";
    var address = "Apt #185";
    var city = "san jose";
    var state = "CA";
    var zipcode = "95126";
    var phone = 6692927191.0;
    var ssn = "123-456-789";
    var i = 10000;
    while(i > 0){
        user = false;
        email = "user" + i + "@gmail.com";
        first_name = "userFirstname" + i;
        last_name = "userLastname" + i;

        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var users = mongo.collection('users');
            users.insert({
                "email": email, 
                "password": password, 
                "first_name": first_name, 
                "last_name": last_name,
                "dob": dob,
                "street":street,
                "address": address,
                "city": city,
                "state": state,
                "zipcode": zipcode,
                "phone": phone,
                "ssn": ssn,
                "host_status":"NA",
                "date":new Date()
            }, function(err, user){
                if(err){
                    throw err;
                }
            });
        });
        i--;
    }
    res.send({"status_code":200});
})*/

module.exports = router;
