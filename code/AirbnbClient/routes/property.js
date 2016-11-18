//Contains APIs related to Property
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var multer  = require('multer');

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
            imagePath = getID() + '.'
                + file.originalname.split('.')[file.originalname.split('.').length -1];
            cb(null, imagePath);
        }
    });
    var upload = multer({ storage: storage}).array('file');
    var json_responses;
    upload(req,res,function(err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        var msg_payload = mapReqToPayLoad(req);


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

function mapReqToPayLoad(req) {
    var msg_payload = {};
    msg_payload.imagesPath = req.files;
    msg_payload.address = {
        street: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        country: req.body.country
    }
    msg_payload.host_id = 1; //stub
    msg_payload.category = req.body.category
    msg_payload.cooredinates = {
        x: req.body.cooredinatesX,
        y: req.body.cooredinatesY
    }
    msg_payload.description = req.body.description;
    msg_payload.guests = req.body.guests;
    msg_payload.bedrooms = req.body.bedrooms;
    msg_payload.bedrooms = req.body.bedrooms;
    msg_payload.start_date = req.body.start_date;
    msg_payload.end_date = req.body.end_date;
    return msg_payload;
}

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

var getID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

module.exports = router;
