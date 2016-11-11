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
}
