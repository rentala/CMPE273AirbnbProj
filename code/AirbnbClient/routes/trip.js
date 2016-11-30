/**
 * Created by Rentala on 15-11-2016.
 */
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var multer = require('multer');
router.get('/tripDetails',function (req,res) {

    var json_responses;
    var msg_payload;
    var user_id = req.param("user_id");
    var host_id = req.param("host_id");


    if(user_id!=null){
        msg_payload = {"user_id":user_id,"host_id":null};
        console.log("inside");
        mq_client.make_request('trip_details_queue',msg_payload,function (err,results) {
            console.log(results);
           if(err){
               //Need to add tool to log error.
               json_responses = {"status_code":400};
               res.send(json_responses);
               res.end();
           }
           else {
               if(results.statusCode == 200){
                   console.log("inside 200"+ JSON.stringify(results.userTrips));
                   json_responses = {"status_code":results.statusCode,"userTrips":results.userTrips};
               }
               else {
                   json_responses = {"status_code":results.statusCode};
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
            	tool.logError(err);
            	json_responses = {"status_code":400};
            	  res.send(json_responses);
                 res.end();
            }
            else {
                if(results.statusCode == 200){
                    console.log("inside 200");
                    json_responses = {"status_code":results.statusCode,"hostTrips":results.hostTrips};
                }
                else {
                    json_responses = {"status_code":results.statusCode};
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
            //Need to add tool to log error.
            tool.logError(err);
            json_responses = {"status_code":400};
            res.send(json_responses);
            res.end();
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

router.post('/createTrip', function(req, res){
  var property_id = req.body.property_id;
  var host_id = req.body.host_id;
  var user_id = req.session.user._id;
  var property_name = req.body.property_name;
  var city_nm = req.body.city
  var state = req.body.state;
  var start_date = req.body.start_date;
  var end_date = req.body.end_date;
  var price = req.body.price;
  var guest = req.body.guests;
  var country = req.body.country;
  var guest_name = req.session.user.first_name;
  /*var payment_details = {
    "mode" : req.body.mode,
    "card_number" : req.body.card_number,
    "cvv" : req.body.cvv,
    "expiry_date" : req.body.expiry_date
  };*/
  var msg_payload = {
    "property_id" : property_id,
    "host_id" : host_id,
    "property_name" : property_name,
    "user_id" : user_id,
    "city_nm" : city_nm,
    "state" : state,
    "start_date" : start_date,
    "end_date" : end_date,
    "price" : price,
    "guest" : guest,
    "country" : country,
    "guest_name":guest_name
    // ,"payment_details" : payment_details
  };
  mq_client.make_request('createTrip_queue', msg_payload, function (err,results) {
        if(err){
            //Need to add tool to log error.
            tool.logError(err);
            json_responses = {"status_code":400};
            res.send(json_responses);
            res.end();
        }
        else {
            if(results.statusCode == 200)
            {
                res.send({"status_code":200});
            }
            else {
                res.send({"status_code":401});
            }
        }
    });
});

router.post('/updateTrip',function (req,res) {
    var json_responses;

    var trip_id = req.param("trip_id");
    var status = req.param("status");

    var msg_payload = {"trip_id":trip_id, "status": status};

    mq_client.make_request('update_trip_queue',msg_payload,function (err,results) {
        if(err){
            //Need to add tool to log error.
            //tool.logError(err);
            json_responses = {"status_code":400};
        }
        else {
            if(results.statusCode == 200)
            {
              console.log("success");
                json_responses = {"status_code":200};
            }
            else {
                json_responses = {"status_code":400};
            }
            res.send(json_responses);
            res.end();
        }
    });
});

router.post('/review/:propertyId', function (req, res, next)  {

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
        var msg_payload = buildPayLoad(req);


        mq_client.make_request('create_trip_review_queue', msg_payload, function(err,results){
            if(err){
                json_responses = {
                    "failed" : "failed"
                };
            } else {
                json_responses = {
                    "reviews" : results.insertedIds[0]
                };
            }
            res.statusCode = results.code;
            res.send(json_responses);
        });
    });

});

function buildPayLoad(req) {
    var msg_payload = {};
    msg_payload.property_id = req.body.property_id;
    msg_payload.review = {
        rating: req.body.rating,
        comment: req.body.comment,
        images: req.files,
        time: new Date().toDateString(),
        user_id: req.session.user_id, //stub get from session
        user_name: req.session.user.first_name,  //stub
        trip_id: req.body.trip_id //stub get from session
    }
    return msg_payload;
}

router.post('/editTrip',function (req,res) {
    var json_responses;

    var trip_id = req.param("trip_id");
    var user_id = req.session.user_id;
    var property_id = req.param("property_id");
    var guests = req.param("guests");
    var start_date = req.param("start_date");
    var end_date = req.param("end_date");

    var msg_payload = {"trip_id":trip_id, "user_id": user_id,"property_id": property_id, "guests": guests, "start_date":start_date, "end_date":end_date};

    mq_client.make_request('edit_trip_queue',msg_payload,function (err,results) {
        if(err){
            throw err;
        }
        else {
            if(results.statusCode == 200)
            {
                json_responses = {"status_code":200,"newTripPrice":results.newTripPrice};
            }
            else {
                json_responses = {"status_code":400};
            }
            res.send(json_responses);
            res.end();
        }
    });
});

router.get('/pendingTripsForApproval',function (req,res) {
    var json_responses;

    var host_id = req.param("host_id");

    var msg_payload = {"host_id":host_id};

    mq_client.make_request('pending_trips_queue',msg_payload,function (err,results) {
        if(err){
            throw err;
            json_responses = {"status_code":500};
        }
        else {
            if(results.statusCode == 200)
            {
                json_responses = {"status_code":results.statusCode,"pending_trips":results.pending_trips};
            }
            else
            {
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
    });
});


//POST method to fetch user's completed trips 
router.post('/userCompletdTrips', function (req, res)  {
   
	console.log("Request Data  : " + JSON.stringify(req.body));
	
	var user_id = req.param("user_id");

	console.log("In AirbnbClient : admin.js : approveHost: User ID :"+ user_id);
	
	var msg_payload = { "user_id" : user_id };
	
	mq_client.make_request('user_completed_trips',msg_payload, function(err,results){
		if(err){
			tool.logError(err);
			var json_resp = {
					"status_code" : 400 
			};
			res.send(json_resp);
			res.end();
		}
		else{
			
			res.send(results.json_resp);
			res.end();
		}  
	});
});


router.get('/myTripDetails',function (req,res) {

    var json_responses;
    var msg_payload;
    var user_id = req.session.user_id;
        msg_payload = {"user_id":user_id,"host_id":null};

        mq_client.make_request('myTrip_details_queue',msg_payload,function (err,results) {
            console.log("results-----------------"+results);
           if(err){
               tool.logError(err);
               json_responses = {"status_code":400};
               res.send(json_responses);
               res.end();
           }
           else {
               if(results.statusCode == 200){
                   json_responses = {"status_code":results.statusCode,"userTrips":results.userTrips,"user_id":user_id,"user":req.session.user};
               }
               else {
                   json_responses = {"status_code":results.statusCode};
               }
               res.send(json_responses);
               res.end();
           }
        });
});

var getID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

router.post('/submitReview', function (req, res, next)  {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../AirbnbClient/public/uploads');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            imagePath = getID() + '.'
                + file.originalname.split('.')[file.originalname.split('.').length -1];
            console.log("file.originalname"+ file.originalname);
            cb(null, imagePath);
        }
    });
    var upload = multer({ storage: storage}).array('file');
    var json_responses;
    upload(req,res,function(err) {
        if (err) {
      	 // tool.logError(err);
            res.json({error_code: 1, err_desc: err});
            return;
        }
        
        var msg_payload = buildPayLoad(req);
        mq_client.make_request('create_trip_review_queue', msg_payload, function(err,results){
        	var json_responses;
        	if(results.statusCode == 200){
                 json_responses = {"status_code":results.statusCode,"userTrips":results.userTrips};
             }
             else {
                 json_responses = {"status_code":results.statusCode};
             }
             res.send(json_responses);
             res.end();
        });
    });

});


router.get('/id/:prop_id/:price/:flow/:trip_id',function (req,res) {

    var prop_id = req.param("prop_id");
    var flow = req.param("flow");
    var trip_id = req.param("trip_id");
    var price = req.param("price");
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
                if(results.prop_array[0].hasOwnProperty('ratings')){
                    ratings_array = results.prop_array[0].ratings;
                    for(var i=0;i<ratings_array.length;i++){
                        total_ratings += ratings_array[i].rating_stars;
                    }
                    avg_ratingbidPropertys = (total_ratings/ratings_array.length);
                } else{
                    //no ratings yet
                    avg_ratings = 0;
                }

                var property = results.prop_array[0];
                var min_bid = 0;
                if(results.bidding.length >0){
                	min_bid = results.bidding[0].max_bid_price;
                }
                var msg = req.session.msg;
                var start_date = msg.start_date;
                var end_date = msg.end_date;
                property.avg_ratings = avg_ratings;
                //req.session.msg = "";
                res.render('./property/propertyDetails.ejs', {property: property,flow:flow,min_bid:min_bid,price:price,guests:msg.guests,trip_id:trip_id});
            }
            else {
                json_responses = {"status_code":results.statusCode};
                res.render('./property/productDetails.ejs', { productNotFound : true});
            }
        }

        res.end();
    });
});

router.post('/acceptBid', function(req, res){
	  var property_id = req.param("property_id");
	  var user_id = req.param("user_id");
	  var guest_name = req.param("bidder_name");
	  var bidPrice = req.param("bidPrice");
	  var bid_id = req.param("bid_id");
	  var msg_payload = {
	    "property_id" : property_id,
	    "user_id" : user_id,
	    "guest_name" : guest_name,
	    "bidPrice" : bidPrice,
	    "bid_id":bid_id
	  };
	  mq_client.make_request('acceptBid_queue', msg_payload, function (err,results) {
	        if(err){
	            //Need to add tool to log error.
	            tool.logError(err);
	            json_responses = {"status_code":400};
	            res.send(json_responses);
	            res.end();
	        }
	        else {
	            if(results.statusCode == 200)
	            {
	                res.send({"status_code":200});
	            }
	            else {
	                res.send({"status_code":401});
	            }
	        }
	    });
	});

module.exports = router;
