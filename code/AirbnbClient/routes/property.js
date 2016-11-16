//Contains APIs related to Property
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

router.get('/search',function (req,res,next) {
    var city = req.param("city");
    var state = req.param("state");
    var zipcode = req.param("zipcode");
    var start_date = req.param("start_date");
    var end_date = req.param("end_date");
    var category = req.param("category");


    var json_responses;

    var msg_payload = {"city":city,"state":state,"zipcode":zipcode,"start_date":start_date,"end_date":end_date,"category":category};

    mq_client.make_request('search_property_queue', msg_payload, function(err,results){
        if(err){
            json_responses = {"status_code":400};
        } else {
            json_responses = {"status_code":200,"result":results.city};
        }
        res.statusCode = results.code;
        res.send(json_responses);
        res.end();
    });











    /*mq_client.make_request('search_property_queue',msg_payload,function (err,results) {
        if(err)
        {
            json_responses = {
                "failed" : results.result
            };
        }
        else{
            console.log('back to client without error');
            json_responses = {
                "product_id" : results.value
            };
        }
        res.send(json_responses);
        res.end();
    });*/





});




router.post('/list', function (req, res, next)  {
    /*var hostId = 1,
        category = req.body.category,
        guests = req.param("guests"),
        street = req.param("street"),
        zip_code = req.param("zip_code"),
        bedrooms = req.param("bedrooms"),
        coordinates = req.param("coordinates"),
        state = req.param("state"),
        zipCode = req.param("zipCode");
        */
    var json_responses;

    var msg_payload = req.body;

    mq_client.make_request('list_property_queue', msg_payload, function(err,results){
        if(err){
            json_responses = {
                "failed" : results.result
            };
        } else {
            json_responses = {
                "product_id" : results.product_id
            };
        }
        res.statusCode = results.code;
        res.send(json_responses);
        res.end();
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