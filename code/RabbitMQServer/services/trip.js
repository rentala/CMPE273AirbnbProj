var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var ObjectID = require('mongodb').ObjectID;

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
                        console.log(result);
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
        console.log("MESSAGE = " + JSON.stringify(msg));
        //console.log("DATE = " + typeof(msg.start_date));
        //console.log("date difference = " + (msg.start_date.getDate() - msg.end_date.getDate()));
        var some = "select datediff('" + msg.end_date + "', '" + msg.start_date + "') as stayDuration";
        mysql.execute_query(function(err, result){
        	if(err){
                res = {"statusCode" : 401, "errMsg" : err};
                callback(null, res);
            }
            else{
            	if(result.length > 0){
            		console.log("timer = " + (result[0].stayDuration));
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
            }
        }, some);
    }
};

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
                    res = {"statusCode":200};
                    callback(null, res);
                }
            },sql_queries.UPDATE_TRIP,[msg.status, msg.trip_id]);
        }
    };

var createTripReview ={
    handle_request : function(connection, msg, callback) {
        var res = {};
        try {
            var coll = connection.mongoConn.collection('property');
            coll.updateOne({_id: new ObjectId(msg.property_id) }, {$push : { reviews: msg.review}}, function(err, results) {

                if (err) {
                    tool.logError(err);
                    res.code = 400;
                    callback(null, res);
                } else {
                    res.code=200;
                    //res.result = results;
                    callback(null, res);
                }

            });
        } catch (err) {
            res.code = 400;
            tool.logError(err);
            callback(null, res);
        }

    }
}
exports.deleteTrip = deleteTrip;
exports.tripDetails = tripDetails;
exports.createTrip = createTrip;
exports.updateTrip = updateTrip;
exports.createTripReview = createTripReview;
