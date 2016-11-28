var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var tool = require("../utili/common");
var ejs = require('ejs');

router.get('/inbox', function (req, res) {
	ejs.renderFile('./views/host/inbox.ejs',{ user_dtls: req.session.user},function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			tool.logError(err);
			res.end('An error occurred');
			console.log(err);
		}
	});
})

router.post('/inboxContent', function(req, res){
	var host_id = req.session.user_id;
	var msg_payload = {
		"host_id" : host_id
	}
	console.log("reached /inboxContent");
	mq_client.make_request('inbox_queue', msg_payload, function(err,results){
        if(err){
      	  tool.logError(err);
            json_responses = {
                "failed" : "failed",
                "result" : results.result,
                "status_code" : 401
            };
        } 
        else {
        	if(results.status_code == 200){
	            json_responses = { 
	            	"result":results.results,
	            	"status_code" : 200,
	            	"userDetails" : results.userDetails
	            };
        	}
        	else if(results.status_code == 403){
        		json_responses = { 
	            	"status_code" : 401
	            };
        	}
        }
        res.send(json_responses);
        res.end();
    });
});
/*router.post('/approveUser',function(req,res){
	var
})*/
module.exports = router;