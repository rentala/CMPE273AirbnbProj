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
    var user_id=req.session.user_id; //stub - get user id from req.session.user_id

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

router.get('/id/:prop_id/:flow',function (req,res) {

    var prop_id = req.param("prop_id");
    var flow = req.param("flow");
    console.log("flow"+flow+"prop_"+prop_id);
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
                if(results.prop.hasOwnProperty('ratings')){
                    ratings_array = results.prop.ratings;
                    for(var i=0;i<ratings_array.length;i++){
                        total_ratings += ratings_array[i].rating_stars;
                    }
                    avg_ratingbidPropertys = (total_ratings/ratings_array.length);
                } else{
                    //no ratings yet
                    avg_ratings = 0;
                }

                var property = results.prop;
                var min_bid = 0;
                
                if(results.prop.hasOwnProperty('bidding') && results.prop.bidding.length >0){
                	min_bid = results.bidding[0].max_bid_price;
                }
                switch (flow){
                    case "book":
                        var msg = req.session.msg;
                        if(msg){
                            var start_date = msg.start_date;
                            var end_date = msg.end_date;
                            var tripStart = new Date(start_date);
                            var tripEnd = new Date(end_date);
                            var stayDuration = parseInt((tripEnd-tripStart)/(24*3600*1000)) + 1;
                            var tripPrice = eval(stayDuration * parseInt(property.price));
                            property.avg_ratings = avg_ratings;
                            res.render('./property/propertyDetails.ejs',
                                {
                                    property: property,
                                    flow:flow,
                                    min_bid:min_bid,
                                    start_date:start_date,
                                    end_date:end_date,
                                    guests:msg.guests,
                                    tripPrice: property.is_auction ? results.bidding[0].max_bid_price : tripPrice,
                                    		user_dtls: req.session.user
                                });
                        } else{
                            res.render('./property/propertyDetails.ejs',
                                {
                                    property: property,
                                    flow:flow,
                                    min_bid:min_bid,
                                    guests:msg.guests,
                                    tripPrice: property.price,
                                    user_dtls: req.session.user
                                });
                        }




                        break;
                    case "edit":
                        var trip_id = req.query.tip;
                        if(trip_id == undefined){
                            res.redirect('/');
                        }
                        res.render('./property/propertyDetails.ejs', {property: property,
                            flow:flow,
                            price: property.price,
                            guests:2,
                            trip_id:trip_id,
                            user_dtls: req.session.user});
                        break;
                    default:
                        //view
                        var start_date = "";
                        var end_date = "";
                        flow = "view";
                        property.avg_ratings = avg_ratings;
                        res.render('./property/propertyDetails.ejs', {property: property,flow:flow,user_dtls: req.session.user,
                            tripPrice: property.is_auction ? results.bidding[0].max_bid_price : tripPrice});
                }
                //req.session.logData = {} property._id
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
        var queue = "";
        var validHost = true;
        
        switch(req.session.user.host_status)
        {
            case "ACCEPTED":
                msg_payload.host_status = "ACCEPTED";
                queue = "list_property_queue";
                msg_payload.isHostActive = true;
                break;
            case "REQUESTED":
                msg_payload.host_status = "REQUESTED";
                queue = "list_property_queue";
                break;
            case "REJECTED":
                validHost = false;
                break;
            default:
                msg_payload.host_status = "REQUESTED";
                queue = "become_host_queue";
                break;

        }
        console.log("queue"+queue);
        if(validHost){
            mq_client.make_request(queue, msg_payload, function(err,results){
                res.statusCode = results.code;
                if(err){
                    tool.logError(err);
                    json_responses = {
                        "failed" : "failed"
                    };
                    res.redirect('/host?err=1');
                } else {
                    req.flash('hostConfirmation', true);
                    req.flash('propertyId', results.propertyIds[0]);
                    if(req.session.user.host_status == "NA")
                    	req.session.user.host_status = "REQUESTED";
                    //res.redirect('/host/confirmation');
                    res.render('./host/confirmation.ejs', { url: "/api/property/id/"+results.propertyIds[0]+"/view",user_dtls: req.session.user});
                }
            });
        }
        else{
            res.redirect('/host?err=InvalidHost');
        }

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
    msg_payload.host_name = req.session.user.last_name + " "+ req.session.user.first_name;
    
    msg_payload.category = req.body.category
    msg_payload.coordinates = {
        x: req.body.coordinatesX,
        y: req.body.coordinatesY
    }
    msg_payload.property_title = req.body.property_title;
    msg_payload.description = req.body.description;
    msg_payload.guests = parseInt(req.body.guests);
    msg_payload.bedrooms = parseInt(req.body.bedrooms);
    msg_payload.is_auction = req.body.forBid == 1 ? true: false;
    msg_payload.start_date = req.body.start_date;
    msg_payload.end_date = req.body.end_date;
    if(req.body.forBid == 1){
        msg_payload.bid_price = req.body.price;
    } else{
        msg_payload.price = req.body.price;
    }
    msg_payload.isHostActive = false;

    return msg_payload;
}

function mapCheckoutRequest(req) {
	var msg_payload = {};
	msg_payload.property_id = req.body.property_id;
	msg_payload.description = req.body.description;
	msg_payload.host_id = req.body.host_id;
	msg_payload.city = req.body.city;
	msg_payload.state = req.body.state;
	msg_payload.country = req.body.country;
	msg_payload.start_date = req.body.start_date;
	msg_payload.end_date = req.body.end_date;
	msg_payload.guests = req.body.guests;
	msg_payload.per_night = req.body.per_night;
	msg_payload.per_week = req.body.per_week;
	msg_payload.per_month = req.body.per_month;
	msg_payload. total = req.body.total;
    
    return msg_payload;
}

var getID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

router.post('/bidProperty', function (req, res, next)  {
    var json_responses;
    
    var msg_payload;
    var user_id = req.session.user_id;
    var property_id = req.param("property_id");
    var bid_id = 1;
    var bid_amount = req.param("bid_amount");
    var property_name = req.param("property_name");

    msg_payload = {"user_id":user_id,"property_id":property_id, "bid_id":bid_id, "bid_amount":bid_amount, "property_name":property_name,"bidder_name":req.session.user.first_name};
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
router.get('/confirmation', function (req, res, next)  {

    var msg = req.session.msg;
    ejs.renderFile('./views/views/confirmation.ejs',{ user_dtls: req.session.user},function(err, result) {
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
	res.send({"valid_property":req.session.valid_property});
});

router.get('/myListings', function (req, res, next)  {
	
	var user_id = req.session.user_id;
	var msg_payload = {"host_id":user_id};
    mq_client.make_request('my_listings_queue', msg_payload, function(err,results){
        if(err){
			tool.logError(err);
        	json_responses = {
                    "status_code" : results.statusCode
                };
        } else {
        	json_responses = {
                    "status_code" : results.statusCode,
                    "records":results.records,
                    "user":req.session.user
                };
        }
        res.send(json_responses);
    });
});

router.post('/paymentGateway', function (req, res, next)  {
	var msg = mapCheckoutRequest(req)	;
    var id = req.query.pid;
    if (req.query.pid == undefined){
        id = "";
    }
	//msg.name = req.session.user.first_name;
	ejs.renderFile('./views/views/cardDetails.ejs',{ data:msg, flow:req.body.flow,  property_id: id},function(err, result) {
		// render on success
		if (!err) {
		res.end(result);
		}
		// render or error
		else {
			console.log('An error occurred');
//			tool.logError(err);
		res.end('An error occurred');
		console.log(err);
		}
		});
});

router.get('/paymentGateway/:flow/:diff', function (req, res, next)  {
    var id = req.query.pid;
    if (req.query.pid == undefined){
        id = "";
    }
	ejs.renderFile('./views/views/cardDetails.ejs',{ diff:req.param("diff"),
        flow:req.param("flow"),
        property_id: id},function(err, result) {
		// render on success
		if (!err) {
		res.end(result);
		}
		// render or error
		else {
			console.log('An error occurred');
//			tool.logError(err);
		res.end('An error occurred');
		console.log(err);
		}
		});
});

router.get('/paymentGateway/:flow/:trip_id/:amount', function (req, res, next)  {
    var id = req.query.pid;
    if (req.query.pid == undefined){
        id = "";
    }
	ejs.renderFile('./views/views/cardDetails.ejs',{ trip_id:req.param("trip_id"),flow:req.param("flow"),
        amount:req.param("amount"),  property_id: id},function(err, result) {
		// render on success
		if (!err) {
		res.end(result);
		}
		// render or error
		else {
			console.log('An error occurred');
//			tool.logError(err);
		res.end('An error occurred');
		console.log(err);
		}
		});
});

module.exports = router;
