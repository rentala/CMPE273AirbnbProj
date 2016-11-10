/**
 * Created by Rentala on 09-11-2016.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/signInUser', function (req, res, next)  {
    passport.authenticate('login', function (err, user, info) {
        if(err){
            return next(err);
        }
        if(!user){
            return res.redirect('/auth/sigin')
        } else{
            req.logIn(user,{session:false}, function(err) {
                if(err) {
                    return next(err);
                }

                console.log("Got the user");
                req.session.user = user;
                return res.redirect('/');
            })
        }
    })(req, res, next);

});

router.get('/signIn', function (req, res) {
    res.render('./authentication/signIn.ejs');
})
module.exports = router;