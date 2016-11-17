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
        		console.log("new user registration", { email: email, firstName: firstName, lastName:lastName});
        		
        		
        		var msg_payload = { "email": email, "password": password, "firstName": firstName, "lastName": lastName,"Dob":Dob,"street":street,
        				"aptNum":aptNum,"city":city,"state":state,"zipCode":zipCode,"phoneNumber":phoneNumber,"ssn":ssn};
            	
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
            				return done(null, "success");
        				}
        				else {    
        					return done(null, "error");
        				}
        			}  
        		});
            })
        );
    
}
