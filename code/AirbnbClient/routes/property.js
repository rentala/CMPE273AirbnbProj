//Contains APIs related to Property
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var multer = require('multer');

router.post('/search',function (req,res,next) {
    var city = req.body.city;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var guests = req.body.guests;


    var json_responses;

    var msg_payload = {"city":city,"start_date":start_date,"end_date":end_date,"guests":guests};

    mq_client.make_request('search_property_queue', msg_payload, function(err,results){
        if(err){
            //Need to handle this error.
            throw err;
        } else {
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"valid_property":results.valid_property};
            }
            else{
                json_responses = {"status_code":results.statusCode,"msg":results.errMsg};
            }
        }
        res.statusCode = results.code;
        res.send(json_responses);
        res.end();
    });

});

router.get('/prop',function (req,res) {

    var prop_id = req.param("prop_id");
    var json_responses;

    var msg_payload={"prop_id":prop_id};

    mq_client.make_request('get_property_by_id_queue',msg_payload,function (err,results) {
        if(err){
            throw err;
        }
        else {
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"prop_array":results.prop_array};
            }
            else {
                json_responses = {"status_code":results.statusCode,"msg":results.errMsg};
            }
        }
        res.send(json_responses);
        res.end();
    });
});


router.post('/list', function (req, res, next)  {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../AirbnbClient/public/uploads');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            imagePath = file.fieldname + '-'
                + datetimestamp + '.'
                + file.originalname.split('.')[file.originalname.split('.').length -1];
            cb(null, imagePath);
        }
    });
    var upload = multer({ storage: storage}).array('photos');
    var json_responses;
    upload(req,res,function(err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        var msg_payload = req.body;

        mq_client.make_request('list_property_queue', msg_payload, function(err,results){
            if(err){
                json_responses = {
                    "failed" : "failed"
                };
            } else {
                json_responses = {
                    "propertyId" : results.insertedIds[0]
                };
            }
            res.statusCode = results.code;
            res.send(json_responses);
        });
    });

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

module.exports = router;
