var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

router.post('/approveHost', function (req, res)  {
    
	console.log("Request Data  : " + JSON.stringify(req.body));
	
	var host_id = req.param("host_id");

	console.log("In AirbnbClient : admin.js : Host_ID :"+ host_id);
	
	var msg_payload = { "host_id" : host_id };
	
	mq_client.make_request('approve_host_queue',msg_payload, function(err,results){
		if(err){
			//TODO : Need to handle error
		}
		else{
			
			res.send(results.json_resp);
			res.end();
		}  
	});
});


module.exports = router;