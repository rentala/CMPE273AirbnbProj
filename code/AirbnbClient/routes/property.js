//Contains APIs related to Property
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var multer = require('multer');

router.get('/search',function (req,res,next) {
    var city = req.param("city");

    var json_responses;

    var msg_payload = {"city":city};

    mq_client.make_request('search_property_queue', msg_payload, function(err,results){
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

router.post('/list', function (req, res, next)  {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../AirbnbClient/public/uploads');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            imagePath = file.fieldname + '-'
                + datetimestamp + '.'
                + file.originalname.split('.')[file.originalname.split('.').length -1];
            cb(null, imagePath);
        }
    });
    var upload = multer({ storage: storage}).array('photos');
    var json_responses;
    upload(req,res,function(err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        var msg_payload = req.body;

        mq_client.make_request('list_property_queue', msg_payload, function(err,results){
            if(err){
                json_responses = {
                    "failed" : "failed"
                };
            } else {
                json_responses = {
                    "propertyId" : results.insertedIds[0]
                };
            }
            res.statusCode = results.code;
            res.send(json_responses);
        });
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