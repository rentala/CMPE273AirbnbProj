var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var tool = require("../utili/common");
var ejs = require("ejs");

router.get('/view',function (req,res) {

    var json_responses;

    //var trip_id = req.param("trip_id");
    var trip_id = req.session.trip1_id;
    var bill_id = req.session.bill1_id;
    req.session.trip1_id = "";
    req.session.bill1_id = "";
    
    var msg_payload={"trip_id":trip_id};

    mq_client.make_request('get_bill_queue',msg_payload,function (err,results) {
        if(err){
            //Need to add tool to log error.
            tool.logError(err);
            json_responses = {"status_code":400};
        }
        else {
            if(results.statusCode==200){
                json_responses = {"status_code":results.statusCode, "bill_dtls":results.bill_dtls,"property_dtls":results.property_dtls,"user_dtls":req.session.user};
            }
            else {
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
    });
});

router.get('/view1',function (req,res) {

    var json_responses;

    //var trip_id = req.param("trip_id");
    var trip_id = req.session.trip1_id;
    var bill_id = req.session.bill1_id;
    req.session.trip1_id = "";
    req.session.bill1_id = "";
    
    var msg_payload={"trip_id":trip_id};

    mq_client.make_request('get_bill_queue',msg_payload,function (err,results) {
        if(err){
            //Need to add tool to log error.
            tool.logError(err);
            json_responses = {"status_code":400};
        }
        else {
            if(results.statusCode==200){
                json_responses = {"status_code":results.statusCode, "bill_dtls":results.bill_dtls,"property_dtls":results.property_dtls,"user_dtls":req.session.guest_name};
                console.log("json_responses = " + json_responses);
            }
            else {
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
    });
});

router.post('/deleteBill',function (req, res) {
    var json_responses;
    var bill_id = req.body.billing_id;
    var msg_payload = {"bill_id":bill_id};

    mq_client.make_request('delete_bill_queue',msg_payload,function (err,results) {
       if(err){
           //Need to add tool to log error.
           tool.logError(err);
           json_responses = {"status_code":400};
       }
       else
       {
           if(results.statusCode==200){
               json_responses={"status_code":200};
           }
           else {
               json_responses = {"status_code":results.statusCode};
           }
       }
        res.send(json_responses);
        res.end();
    });
});

router.get('/viewBill', function (req, res, next)  {
	var bill_id = req.param("bill_id");
	var trip_id = req.param("trip_id");
	
	
	req.session.bill1_id = bill_id;
	req.session.trip1_id = trip_id;
	ejs.renderFile('./views/views/bill.ejs',function(err, result) {
		if (!err) {
		res.end(result);
		}
		else {
			tool.logError(err);
		res.end('An error occurred');
		console.log(err);
		}
		});
});

router.get('/viewBill1', function (req, res, next)  {
  var bill_id = req.param("bill_id");
  var trip_id = req.param("trip_id");
  var guest_name = req.param("guest_name");
  console.log("guest_name = " + guest_name);

  
  
  req.session.bill1_id = bill_id;
  req.session.trip1_id = trip_id;
  req.session.guest_name = {"first_name" : guest_name};
  console.log("req.session.guest_name = " + req.session.guest_name);
  ejs.renderFile('./views/views/billAdmin.ejs',function(err, result) {
    if (!err) {
    res.end(result);
    }
    else {
      tool.logError(err);
    res.end('An error occurred');
    console.log(err);
    }
    });
});

module.exports = router;