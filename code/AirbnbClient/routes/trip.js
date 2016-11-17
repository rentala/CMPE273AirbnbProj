/**
 * Created by Rentala on 15-11-2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');


router.get('/userTripDetails',function (req,res) {

    var json_responses;

    var user_id = req.param("user_id");

    //var msg_payload = {"user_id"}
});



module.exports = router;