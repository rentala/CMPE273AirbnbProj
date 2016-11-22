/**
 * Created by Rentala on 09-11-2016.
 */

var ejs = require("ejs");
var express = require('express');
var router = express.Router();
var passport = require('passport');
var tool = require("../utili/common");

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

                console.log("Got the user");
                req.session.user = user;

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

});

router.get('/home', function (req, res, next)  {
	console.log("assadsdsadsa"+JSON.stringify(req.session.user));
	//user_dtls = JSON.parse(data.user)
	var j = JSON.stringify(req.session.user);
	j = JSON.parse(j);
	console.log("dsadasdsadsfirst_name"+j.first_name);
	//console.log("assads"+ JSON.parse(req.session.user));
	ejs.renderFile('./views/views/home.ejs',{ user_dtls: j},function(err, result) {
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

module.exports = router;
