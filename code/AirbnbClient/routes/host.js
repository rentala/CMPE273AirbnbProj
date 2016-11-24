/**
 * Created by Rentala on 11-11-2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var tool = require("../utili/common");

/* GET users listing. */
router.get('/', function(req, res, next) {
    var error = req.flash('hostError').length >0 ? true : false;
    res.render('./host/becomeHost.ejs', { error: error } );
});
router.get('/confirmation', function(req, res, next) {
    console.log("in confirmation");
    if(req.flash('hostConfirmation')){
        res.render('./host/confirmation.ejs', { url: "/api/property/"+req.flash('propertyId')});
    } else{
        req.redirect('/host?err=1');
    }
});
router.post('/delete/:id', function(req, res, next) {

    var json_responses;
    var msg_payload = {"id":req.param("id")};
    mq_client.make_request('delete_host_queue', msg_payload, function(err,results){
        if(err){
      	  tool.logError(err);
            json_responses = {
                "failed" : "failed",
                "result" : results.result
            };
        } else {
            json_responses = { "result":results.result};
        }
        res.status_code = results.code;
        res.send(json_responses);
        res.end();
    });
})


router.post('/review/:userId/:propertyId', function (req, res, next)  {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../AirbnbClient/public/uploads');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            imagePath = getID() + '.'
                + file.originalname.split('.')[file.originalname.split('.').length -1];
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
        var msg_payload = buildPayLoad(req);


        mq_client.make_request('review_user_queue', msg_payload, function(err,results){
            if(err){
                json_responses = {
                    "failed" : "failed"
                };
            } else {
                json_responses = {
                    "reviews" : results.insertedIds[0]
                };
            }
            res.statusCode = results.code;
            res.send(json_responses);
        });
    });

});

function buildPayLoad(req) {
    var msg_payload = {};
    msg_payload.user_id = req.param("userId");
    msg_payload.review = {
        rating: req.body.rating,
        comment: req.body.comment,
        images: req.files,
        time: new Date().toDateString(),
        host_id: 1, //stub get from session
        host_name: "Trump",  //stub
        trip_id: 1, //stub get from session
        property_id: req.param("propertyId") //stub get from session
    }
    return msg_payload;
}


module.exports = router;
