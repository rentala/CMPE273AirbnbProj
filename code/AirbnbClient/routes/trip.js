/**
 * Created by Rentala on 15-11-2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

router.get('/tripDetails',function (req,res) {

    var json_responses;
    var msg_payload;
    var user_id = req.param("user_id");
    var host_id = req.param("host_id");


    if(user_id!=null){
        msg_payload = {"user_id":user_id,"host_id":null};

        mq_client.make_request('trip_details_queue',msg_payload,function (err,results) {
            console.log(results);
           if(err){
               throw err;
           }
           else {
               if(results.statusCode == 200){
                   console.log("inside 200");
                   json_responses = {"status_code":results.statusCode,"userTrips":results.userTrips};
               }
               else {
                   json_responses = {"status_code":results.statusCode,"msg":results.errMsg};
               }
               res.send(json_responses);
               res.end();
           }
        });
    }
    else{
        msg_payload = {"user_id":null,"host_id":host_id};

        mq_client.make_request('trip_details_queue',msg_payload,function (err,results) {
            console.log(results);
            if(err){
                throw err;
            }
            else {
                if(results.statusCode == 200){
                    console.log("inside 200");
                    json_responses = {"status_code":results.statusCode,"hostTrips":results.hostTrips};
                }
                else {
                    json_responses = {"status_code":results.statusCode,"msg":results.errMsg};
                }
                res.send(json_responses);
                res.end();
            }
        });
    }
});



router.post('/delete',function (req,res) {
    var json_responses;

    var trip_id = req.param("trip_id");

    var msg_payload = {"trip_id":trip_id};

    mq_client.make_request('delete_trip_queue',msg_payload,function (err,results) {
        if(err){
            throw err;
        }
        else {
            if(results.statusCode == 200)
            {
                json_responses = {"status_code":200};
            }
            else {
                json_responses = {"status_code":401};
            }
            res.send(json_responses);
            res.end();
        }
    });
});

/*
{
	"property_id":1001,
	"city_nm":"San Jose",
	"state":"CA",
	"start_date":"10/20/2016",
	"end_date":"10/22/2016",
	"price":400,
	"guest":3,
	"country":"USA",
	"payment_details" : {
		"mode":"credit",
		"card_number":"1222-3333-2222-1111",
		"cvv":"123",
		"expiry_date":"10-22"
	}
}
*/

router.post('/createTrip', function(req, res){
	var property_id = req.body.property_id;
	var host_id = req.body.host_id;
	var user_id = req.session.user._id;
	var city_nm = req.body.city_nm;
	var state = req.body.state;
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var price = req.body.price;
	var guest = req.body.guest;
	var country = req.body.country;
	var payment_details = {
		"mode" : req.body.mode,
		"card_number" : req.body.card_number,
		"cvv" : req.body.cvv,
		"expiry_date" : req.body.expiry_date
	};
	var msg_payload = {
		"property_id" : property_id,
		"host_id" : host_id,
		"user_id" : user_id,
		"city_nm" : city_nm,
		"state" : state,
		"start_date" : start_date,
		"end_date" : end_date,
		"price" : price,
		"guest" : guest,
		"country" : country,
		"payment_details" : payment_details
	};
	mq_client.make_request('createTrip_queue', msg_payload, function (err,results) {
        if(err){
            throw err;
        }
        else {
            if(results.statusCode == 200)
            {
                json_responses = {"status_code":200};
            }
            else {
                json_responses = {"status_code":401};
            }
            res.send(json_responses);
            res.end();
        }
    });
});

module.exports = router;
