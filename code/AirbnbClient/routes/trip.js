/**
 * Created by Rentala on 15-11-2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');

<<<<<<< HEAD
=======

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



module.exports = router;
>>>>>>> 1b93eeed19f13d378e2c81e3d620db30f5d858a0
