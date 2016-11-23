var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var tool = require("../utili/common");

router.get('/inbox', function(req, res){
	var host_id = req.body.user_id;
	var msg_payload = {
		"host_id" : host_id
	}
	mq_client.make_request('inbox_queue', msg_payload, function(err,results){
        if(err){
      	  tool.logError(err);
            json_responses = {
                "failed" : "failed",
                "result" : results.result,
                "status_code" : 403
            };
        } 
        else {
        	if(results.status_code == 200){
	            json_responses = { 
	            	"result":results.results,
	            	"status_code" : 200
	            };
        	}
        	else if(results.status_code == 403){
        		json_responses = { 
	            	"status_code" : 403
	            };
        	}
        }
        res.send(json_responses);
        res.end();
    });
});