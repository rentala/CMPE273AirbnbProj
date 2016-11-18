//Contains APIs related to Property
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

router.get('/search',function (req,res,next) {
    var city = req.param("city");
    var start_date = req.param("start_date");
    var end_date = req.param("end_date");
    var guests = req.param("guests");


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
        res.send(json_responses);
        res.end();
    });

});




router.post('/list', function (req, res, next)  {
    var json_responses;

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

module.exports = router;