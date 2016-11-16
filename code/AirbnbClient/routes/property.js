//Contains APIs related to Property
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

router.get('/searchProperty',function (req,res,next) {
    var city = req.param("city");

    var json_responses;

    var msg_payload = {"city":city};

    mq_client.make_request('search_property_queue',msg_payload,function (err,results) {
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
    });


    /*“state”: “CA”,
     “zipcode”: 34234,
     “start_date”: “12/12/2019”,
     “end_date”: “12/19/2019”
     “category”: “APT”*/


});




router.post('/listProperty', function (req, res, next)  {
    var hostId = 1,
        category = req.param("category"),
        guests = req.param("guests"),
        street = req.param("street"),
        address = req.param("address"),
        zip_code = req.param("zip_code"),
        bedrooms = req.param("bedrooms"),
        coordinates = req.param("coordinates"),
        state = req.param("state"),
        zipCode = req.param("zipCode");

    var json_responses;

    var msg_payload = { "hostId": hostId, "category": category, "guests": guests, "street": street,
        "address": address,"zip_code":zip_code,"bedrooms":bedrooms, "coordinates":coordinates,"state":state,"zipCode":zipCode };

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