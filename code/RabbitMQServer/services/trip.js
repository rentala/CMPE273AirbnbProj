var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var ObjectID = require('mongodb').ObjectID;
var billing = require('./billing');

var tripDetails = {
    handle_request : function (connection,msg,callback) {
        var res = {};
        try{
            if(msg.user_id!=null){
                mysql.execute_query(function (err,result) {
                    if(err){
                        res = {"statusCode":401,"errMsg":err};
                        tool.logError(err);
                        callback(null, res);
                    }
                    else {
                        if(result.length>0){
                            res = {"statusCode":200,"userTrips":result};
                            callback(null, res);
                        }
                        else
                        {
                            res = {"statusCode":400,"errMsg":"There is no matching row in MySQL"};
                            callback(null, res);
                        }
                    }
                },sql_queries.FETCH_USER_TRIP_DETAILS,[msg.user_id]);
            }
            else {
                mysql.execute_query(function (err,result) {
                    if(err){
                        res = {"statusCode":401,"errMsg":err};
                        tool.logError(err);
                        callback(null, res);
                    }
                    else {
                        console.log(result);
                        if(result.length>0){
                            res = {"statusCode":200,"hostTrips":result};
                            callback(null, res);
                        }
                        else
                        {
                            res = {"statusCode":400,"errMsg":"There is no matching row in MySQL"};
                            callback(null, res);
                        }
                    }
                },sql_queries.FETCH_HOST_TRIP_DETAILS,[msg.host_id]);
            }
        }
        catch(err){
            res = {"statusCode":401,"errMsg":err};
            tool.logError(err);
            callback(null, res);
        }
    }
};

var deleteTrip = {
    handle_request: function (connection, msg, callback) {
        var res = {};
        mysql.execute_query(function (err, result) {
            if(err){
                res = {"statusCode":401,"errMsg":err};
                tool.logError(err);
                callback(null, res);
            }
            else {
                res = {"statusCode":200};
                callback(null, res);
            }
        },sql_queries.DELETE_TRIP,[msg.trip_id]);
    }
};

var createTrip = {
    handle_request: function (connection, msg, callback) {
        var res = {};
        var trip_price;
        var some = "select datediff('" + msg.end_date + "', '" + msg.start_date + "') as stayDuration";
        mysql.execute_query(function(err, result){
        	if(err){
                res = {"statusCode" : 401, "errMsg" : err};
                callback(null, res);
            }
            else{
            	if(result.length > 0 && result[0].stayDuration > 0){
            		trip_price = (result[0].stayDuration) * Number(msg.price);
            		console.log("Trip Price = " + trip_price);
            		mysql.execute_query(function(err, result){
                        if(err){
                            res = {"statusCode" : 401, "errMsg" : err};
                            callback(null, res);
                        }
                        else{
                            res = {"statusCode" : 200};
                            callback(null, res);
                        }
                    }, sql_queries.CREATE_TRIP, [msg.user_id, msg.property_id, msg.property_name, msg.host_id, msg.start_date, msg.end_date, msg.guest, 'PENDING', trip_price]);
            	}
            	else{
            		res = {"statusCode" : 400, "errMsg" : err};
                    callback(null, res);
            	}
            }
        }, some);
    }
};

//Method to changes the status of trip to 'Accepted' and create a billing entry 
var updateTrip = {
        handle_request: function (connection, msg, callback) {
            var res = {};
            mysql.execute_query(function (err, result) {
                if(err){
                    res = {"statusCode":400,"errMsg":err};
                    tool.logError(err);
                    callback(null, res);
                }
                else {
               	 	JSON.stringify("In RabbitMQ : trip.js : updateTrip :result of updation : " +result)	;
               	
                  	 //Creating a new entry in 'billing' table for the approved trip
                  	 billing.createBill.handle_request(connection, {"trip_id" : msg.trip_id}, function(err,res) {
               		 
               		 if(err){
               			 console.log("In RabbitMQ server : trip : updateTrip : Error while creating new entry for bill! " + err);
               			 res = {"statusCode":400,"errMsg":err};
                         tool.logError(err);
                         callback(null, res);
               		 }else{
 
               			 JSON.stringify("In RabbitMQ : trip.js : updateTrip :result of creating a new bill : " + JSON.stringify(res)) ;
               			 callback(null,res);
               		 }
               	 });
                }
            },sql_queries.UPDATE_TRIP,[msg.status, msg.trip_id]);
        }
    };

var createTripReview ={
    handle_request : function(connection, msg, callback) {
        var res = {};
        try {
            var coll = connection.mongoConn.collection('property');
            coll.update({"_id": ObjectID(msg.property_id) }, {$push : { reviews: msg.review}}, function(err, results) {
                if (err) {
                    tool.logError(err);
                    res.code = 400;
                    callback(null, res);
                } else {
                	mysql.execute_query(function (err, result) {
                    res.code=200;
                    callback(null, res);
                	 },sql_queries.TRIP_REVIEWED,[msg.review.rating,msg.review.comment,msg.review.trip_id]);
                }

            });
        } catch (err) {
            res.code = 400;
            tool.logError(err);
            callback(null, res);
        }

    }
}


var editTrip = {
	    handle_request: function (connection, msg, callback) {
	        var res = {};
	        var start_date;
	        var end_date;
	        var coll = connection.mongoConn.collection('property');
	        var tripStart = new Date(msg.start_date);
	        var tripEnd = new Date(msg.end_date);
	        var newTripPrice;
	        var stayDuration = parseInt((tripEnd-tripStart)/(24*3600*1000));
	        //if new trip duration is less than 1, return back without performing any operations 
	        if(stayDuration <1){
	        	res = {"statusCode":400,"errMsg":"Sorry cannot update property"};
                callback(null, res);
	        }
	        else
	        {	
	        coll.findOne({"_id":ObjectID(msg.property_id)}, function (err,record) {
                if(err)
                {
                    res = {"statusCode":400,"errMsg":err};
                    tool.logError(err);
                    callback(null, res);
                }
                else {
                    if(record != null){
                    	start_date = record.start_date;
                    	end_date = record.end_date;
                    	//calculating new trip price
                    	newTripPrice = eval(stayDuration * parseInt(record.price));
                    	
                    	var propStart = new Date(start_date);
            	        var propEnd = new Date(end_date);
            	        //Verifying if new trip duration falls under the property listing dates, return back without performing any operations if dates are out of listing dates
                    	if(propStart<= tripStart && propEnd >= tripEnd){
	                    	mysql.execute_query(function (err, result) {
	                            if(err){
	                                res = {"statusCode":400,"errMsg":err};
	                                tool.logError(err);
	                                callback(null, res);
	                            }
	                            else {
	                                res = {"statusCode":200};
	                                callback(null, res);
	                            }
	                        },sql_queries.UPDATE_TRIP_DATES,[msg.start_date, msg.end_date, msg.guests,newTripPrice, msg.trip_id]);
                    	}
                    	else{
                    		res = {"statusCode":400,"errMsg":"Sorry cannot update property"};
                            callback(null, res);
                    	}
                    }
                    else {
                        res = {"statusCode":400,"errMsg":"Sorry cannot update property"};
                        callback(null, res);
                    }
                }

            });
	        
	        
	        }
	    }
	};


var pendingTripsForApproval = {
    handle_request:function (connection,msg,callback) {
        var res = {};

        mysql.execute_query(function (err,result) {
           if(err){
               tool.logError(err);
               res = {"statusCode":401};
               callback(null,res);
           }
           else{
               if(result.length>0){
                    res = {"statusCode":200,"pending_trips":result};
                    callback(null,res);
               }
               else
               {
                   res = {"statusCode":402};
                   callback(null,res);
               }
           }
        },sql_queries.FETCH_PENDING_TRIPS,[msg.host_id]);
    }
};



var user_completed_trips = {
	    handle_request: function (connection, msg, callback) {
	        var res = {};
	        var json_resp = {};
	        mysql.execute_query(function (err, result) {
	            if(err){
	                json_resp= {"status_code":401,"errMsg":err};
	                tool.logError(err);
	                res = {"json_resp" : json_resp};
	                callback(null, res );
	            }
	            else {
	            	if(result.length>0){

	            		json_resp= {"status_code":200,"trip_dtls" : result};
	            	}else{
	            		
	            		json_resp= {"status_code":401};
	            	}
	            	res = {"json_resp" : json_resp};
	               callback(null, res );
	            }
	        },sql_queries.USER_COMPLETED_TRIPS,[msg.user_id]);
	    }
	};

exports.deleteTrip = deleteTrip;
exports.tripDetails = tripDetails;
exports.createTrip = createTrip;
exports.updateTrip = updateTrip;
exports.createTripReview = createTripReview;
exports.editTrip = editTrip;
exports.pendingTripsForApproval = pendingTripsForApproval;
exports.user_completed_trips = user_completed_trips;