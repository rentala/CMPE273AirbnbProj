/**
 * Created by Rentala on 11-11-2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('./host/becomeHost.ejs');
});

router.post('/delete/:id', function(req, res, next) {

    var json_responses;
    var msg_payload = {"id":req.param("id")};
    mq_client.make_request('delete_host_queue', msg_payload, function(err,results){
        if(err){
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

module.exports = router;
