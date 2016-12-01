/**
 * Created by Rentala on 09-11-2016.
 */
var LocalStrategy   = require('passport-local').Strategy;
var mq_client = require('../rpc/client');
//var bcrypt   = require('bcrypt');
module.exports = function(passport){
    passport.use('login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows  us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        var msg_payload = { "email": email, "password": password };
        console.log("In POST Request = UserName:"+ email+" "+password);

        mq_client.make_request('login_queue',msg_payload, function(err,results){

            console.log(results);
            if (err)
                return done(err);
            console.log(results.code);
            // if no user is found, return the message
            if (results.code == 400)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            //chnage to compare encrypted forms
            console.log(msg_payload.password + " " + results.value.password);
            if (!msg_payload.password == results.value.password){
                console.log("Password is good");
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            return done(null, results.value);
        });
    }));
    
    passport.use(
            'signup',
            new LocalStrategy({
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true
            },
            function(req, username, password,  done) {
            	var first_name = req.param("firstName");
            	var last_name = req.param("lastName");
            	var email = req.param("email");
            	var password = req.param("password");
            	var dob = req.param("Dob");
            	var street = req.param("street");
            	
            	var address = req.param("aptNum");
            	var city = req.param("city");
            	var state = req.param("state");
            	var zipcode = req.param("zipCode");
            	var phone = req.param("phoneNumber");            	
            	var ssn = req.param("ssn");            	
        		var msg_payload = { "email": email, "password": password, "first_name": first_name, "last_name": last_name,"dob":dob,"street":street,
        				"address":address,"city":city,"state":state,"zipcode":zipcode,"phone":phone,"ssn":ssn};
            	
            	mq_client.make_request('register_queue',msg_payload, function(err,results){
        			if(err){
        				return done(null, "error");
        			}
        			else 
        			{
        				if (results.code == 401)
                            return done(null, false, req.flash('signupMessage', 'Email already exists'));
        				else if(results.code == 200){
        					req.session.last_ts = "";
            				req.session.user_id = results.user_id;
            				req.session.first_nm = results.first_nm ;
            				req.session.user = results.user.ops[0];
            				console.log("req.session.user"+ JSON.stringify(results.user.ops[0]));
            				return done(null, "success");
        				}
        				else {    
        					return done(null, "error");
        				}
        			}  
        		});
            })
        );

    passport.use('adminLoginRequest', new LocalStrategy(function(username, password, done) {
        var msg_payload = { "email": username, "password": password };
        console.log("message payload sending from passport= " + msg_payload);
        console.log("In POST Request = UserName:"+ username+" "+password);

        mq_client.make_request('adminLoginRequest_queue',msg_payload, function(err,results){

            console.log(results);
            if (err)
                return done(err);
            if (results.statusCode == 400){
                return done(null, false);
            }
            else if (results.statusCode == 200){
                return done(null, results);
            }            
        });
    }));
    
};
