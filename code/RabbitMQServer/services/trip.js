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
/*"property_id" : property_id,
        "host_id" : host_id,
        "user_id" : user_id,
        "city_nm" : city_nm,
        "state" : state,
        "start_date" : start_date,
        "end_date" : end_date,
        "price" : price,
        "guest" : guest,
        "country" : country,
        "payment_details" : payment_details*/

var createTrip = {
    handle_request: function (connection, msg, callback) {
        var res = {};
        console.log("MESSAGE = " + msg);
        mysql.execute_query(function(err, result){

        }, sql_queries.CREATE_TRIP, [msg.user_id, msg.property_id, msg.host_id, msg.start_date, msg.end_date, msg.guest, 'PENDING'])

    }
}
exports.deleteTrip = deleteTrip;
exports.tripDetails = tripDetails;
exports.createTrip = createTrip;