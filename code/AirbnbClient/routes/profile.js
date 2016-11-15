/**
 * Created by Rentala on 09-11-2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

router.post('/updateProfile', function (req, res, next)  {
    var json_responses;
//    var user_id = req.session.user_id;
    var user_id = req.param("user_id");
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
	//logger.event("new user registration", { email: email, first_name: firstName});
	console.log("user updation", { email: email, firstName: firstName, lastName:lastName});
	
	
	var msg_payload = { "user_id":user_id, "email": email, "password": password, "firstName": firstName, "lastName": lastName,"Dob":Dob,"street":street,
			"aptNum":aptNum,"city":city,"state":state,"zipCode":zipCode,"phoneNumber":phoneNumber,"ssn":ssn};
	
	mq_client.make_request('update_profile_queue',msg_payload, function(err,results){
		if(err){
			return done(null, "error");
		}
		else 
		{
			if (results.code == 401)
                return done(null, false, req.flash('updateProfileMessage', 'Error updating profile'));
			else if(results.code == 200){
				return done(null, "success");
			}
			else {    
				return done(null, "error");
			}
		}  
	});


});


router.post('/dummy', function (req, res, next)  {
    var json_responses;
    console.log("inside signUpUser");
    passport.authenticate('signup', function (err, user, info) {
        if(err){
        	console.log("err::" + err);
            return next(err);
        }
        if(!user){
            json_responses={"status_code":401};
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

module.exports = router;
