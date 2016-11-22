
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var tool = require("../utili/common");

router.get('/topProp',function (req,res) {
    var no_of_props= req.param("no_of_props");
    var json_responses;
    var msg_payload = {"no_of_props":no_of_props};

    mq_client.make_request('top_property_queue',msg_payload,function (err,results) {

        if(err)
        {
      	   tool.logError(err);
            json_responses = {"status_code":400};
        }
        else{
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"top_property":results.top_property};
            }
            else{
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
    });

});

router.get('/cityWiseData',function (req,res) {

    var json_responses;
    var city = req.param("city");

    var msg_payload = {"city":city};

    mq_client.make_request('city_wise_data_queue',msg_payload,function (err,results) {

        if(err){
      	   tool.logError(err);
            json_responses = {"status_code":400};
        }
        else {
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"city_wise_data":results.city_wise_data};
            }
            else{
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
    });

});

router.get('/topHost',function (req,res) {
    var no_of_hosts= req.param("no_of_hosts");
    var json_responses;
    var msg_payload = {"no_of_hosts":no_of_hosts};

    mq_client.make_request('top_host_queue',msg_payload,function (err,results) {

        if(err)
        {
      	   tool.logError(err);
            json_responses = {"status_code":400};
        }
        else{
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"top_host":results.top_host};
            }
            else{
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
    });

});



module.exports =router;