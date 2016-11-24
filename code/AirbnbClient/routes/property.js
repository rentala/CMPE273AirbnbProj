var ejs = require("ejs");
//Contains APIs related to Property
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var multer = require('multer');
var tool = require("../utili/common");

router.post('/search',function (req,res,next) {
    var city = req.param("city");
    var start_date = req.param("start_date");
    var end_date = req.param("end_date");
    var guests = req.param("guests");
    var user_id=4; //stub - get user id from req.session.user_id

    var json_responses;

    var msg_payload = {"city":city,"start_date":start_date,"end_date":end_date,"guests":parseInt(guests),"user_id":user_id};

    mq_client.make_request('search_property_queue', msg_payload, function(err,results){
        if(err){
            //Need to add tool to log error.
            tool.logError(err);
            json_responses = {"status_code":400};
        } else {
            if (results.statusCode == 200) {
                json_responses = {"status_code": results.statusCode, "valid_property": results.valid_property};
                req.session.valid_property = results.valid_property
                req.session.msg = results.msg;
            }
            else {
                json_responses = {"status_code": results.statusCode};
                req.session.msg = results.msg;
                req.session.valid_property = results.valid_property
            }
        }
        res.send(json_responses);
        res.end();
    });
});

router.get('/id/:prop_id',function (req,res) {

    var prop_id = req.param("prop_id");
    var json_responses;

    var msg_payload={"prop_id":prop_id};
    var ratings_array = [];
    var total_ratings=0;
    var avg_ratings;
    mq_client.make_request('get_property_by_id_queue',msg_payload,function (err,results) {
        if(err){
            //Need to add tool to log error.
            tool.logError(err);
            json_responses = {"status_code":400};
        }
        else {
            if(results.statusCode == 200){
                if(results.prop_array[0].hasOwnProperty('ratings')){
                    ratings_array = results.prop_array[0].ratings;
                    console.log(ratings_array);
                    for(var i=0;i<ratings_array.length;i++){
                        total_ratings += ratings_array[i].rating_stars;
                    }
                    avg_ratings = (total_ratings/ratings_array.length);
                } else{
                    //no ratings yet
                    avg_ratings = 0;
                }

                var property = results.prop_array[0];
                property.avg_ratings = avg_ratings;
                res.render('./property/propertyDetails.ejs', {property: property});
            }
            else {
                json_responses = {"status_code":results.statusCode};
                res.render('./property/productDetails.ejs', { productNotFound : true});
            }
        }

        res.end();
    });
});

router.get('/propList',function (req,res) {
    var json_responses;

    var msg_payload = {};

    mq_client.make_request('get_all_property_queue',msg_payload,function (err,results) {
        if(err){
            //Need to add tool to log error.
            tool.logError(err);
            json_responses = {"status_code":400};
        }
        else {
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"prop_array":results.prop_array};
            }
            else {
                json_responses = {"status_code":results.statusCode};
            }
        }
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
      	  tool.logError(err);
            res.json({error_code: 1, err_desc: err});
            return;
        }
        var msg_payload = mapReqToPayLoad(req);

        mq_client.make_request('list_property_queue', msg_payload, function(err,results){
            res.statusCode = results.code;
            if(err){
            	tool.logError(err);
                json_responses = {
                    "failed" : "failed"
                };
                req.redirect('/host?err=1');
            } else {
                req.flash('hostConfirmation', true);
                req.flash('propertyId', results.propertyId[0]);
                res.redirect('/host/confirmation');
            }
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
    //msg_payload.host_id = 1; //stub
    msg_payload.host_id = req.session.user_id; 
    msg_payload.category = req.body.category
    msg_payload.coordinates = {
        x: req.body.coordinatesX,
        y: req.body.coordinateY
    }
    msg_payload.description = req.body.description;
    msg_payload.guests = parseInt(req.body.guests);
    msg_payload.bedrooms = parseInt(req.body.bedrooms);
    msg_payload.is_auction = req.body.forBid == 1 ? true: false;
    msg_payload.start_date = req.body.start_date;
    msg_payload.end_date = req.body.end_date;
    msg_payload.price = { per_night: req.body.per_night, per_week:  req.body.per_week,  per_month:  req.body.per_month };
    return msg_payload;
}
var getID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};
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

router.post('/bidProperty', function (req, res, next)  {
    var json_responses;
    
    var msg_payload;
    var user_id = req.param("user_id");
    var property_id = req.param("property_id");
    var bid_id = req.param("bid_id");
    var bid_amount = req.param("bid_amount");

    msg_payload = {"user_id":user_id,"property_id":property_id, "bid_id":bid_id, "bid_amount":bid_amount};
    mq_client.make_request('bid_property_queue', msg_payload, function(err,results){
        if(err){
			tool.logError(err);
        	json_responses = {
                    "status_code" : results.statusCode
                };
        } else {
        	json_responses = {
                    "status_code" : results.statusCode
                };
        }
        res.send(json_responses);
    });
});

router.get('/searchResult', function (req, res, next)  {
	
	var msg = req.session.msg;
	console.log("end_date: "+ msg.end_date);
	ejs.renderFile('./views/views/searchResult.ejs',{ user_dtls: req.session.user,start_date:msg.start_date,end_date: msg.end_date, guests: msg.guests},function(err, result) {
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
});

router.post('/getResults', function (req, res, next)  {
	console.log("assadsdsadsa"+JSON.stringify(req.session.user));
	res.send({"valid_property":req.session.valid_property});
});

router.get('/myListings', function (req, res, next)  {
	
	var user_id = req.session.user_id;
	console.log("user_id: "+ user_id);
	var msg_payload = {"host_id":user_id};
    mq_client.make_request('my_listings_queue', msg_payload, function(err,results){
        if(err){
			tool.logError(err);
        	json_responses = {
                    "status_code" : results.statusCode
                };
        } else {
        	console.log(JSON.stringify(results.records));
        	json_responses = {
                    "status_code" : results.statusCode,
                    "records":results.records,
                    "user":request.session.user
                };
        }
        res.send(json_responses);
    });
});


module.exports = router;
