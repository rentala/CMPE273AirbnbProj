/**
 * Created by Rentala on 15-11-2016.
 */
var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var ObjectID = require('mongodb').ObjectID;
var listProperty = {
    handle_request : function (connection, msg, callback){
        try{
            var res = {};
            var coll = connection.mongoConn.collection('property');
            coll.insert(msg, function(err, prop){
                if(err){
                    tool.logError(err);
                    res.code ="400";
                    callback(null, res);
                }
                else
                {
                    res.user_id = prop.insertedIds,
                    res.code ="200";
                    callback(null, res);
                }
            });
        }
        catch(err){
            tool.logError(err);
            res.statusCode = "500";
            callback(null, res);
        }
    }
};

var searchProperty = {
    handle_request : function (connection,msg,callback) {
        var res = {};
        var available_property = [];
        var valid_property = [];
        try{
            var coll = connection.mongoConn.collection('property');
            coll.find({city: msg.city,state:msg.state,zipcode:msg.zipcode,category:msg.category,start_date:{$gte:new Date(msg.start_date)},end_date:{$lt:new Date(msg.end_date)}},function(err, records){
                if(err){
                    res = {"statusCode":401,"errMsg":err};
                    tool.logError(err);
                    callback(null, res);
                }
                records.toArray(function (e,recs) {
                    if (recs.length>0){
                        available_property = getPropertyArray(recs);
                        mysql.fetchTripDates(function (err, result) {
                            if(err){
                                //need to handle error.
                                throw err;
                            }
                            else {
                                if(result.length>0){
                                    for(var i=0;i<result.length;i++){
                                        if((new Date(msg.start_date))>=result[i].checkin_date && (new Date(msg.end_date))<=result[i].checkout_date){
                                            // Deleting dates within trip dates.
                                            if(i != -1) {
                                                var invalid_property_index = recs.indexOf(result[i].property_id);

                                                if(invalid_property_index!=-1){
                                                    recs.splice(invalid_property_index,1);
                                                }
                                            }
                                        }
                                    }
                                    valid_property = recs;
                                    res = {"statusCode":200,"valid_property":recs};
                                    callback(null, res);
                                }
                                else {
                                    res = {"statusCode":400,"errMsg":"Error While retrieving rows from MySQL"};
                                    callback(null, res);
                                }
                            }
                        },sql_queries.FETCH_TRIP_DATES,[available_property]);
                    }
                    else {
                        //No Matching Dates.
                        res = {"statusCode":402,"errMsg":"Sorry there are no matching records in the document"};
                        callback(null, res);
                    }
                });

            });
        }
        catch(err)
        {
            tool.logError(err);
            res = {"statusCode":500,"errMsg":err};
            callback(null, res);
        }
    }
};

var getPropertyById = {
    handle_request: function (connection, msg, callback) {
        var res = {};

        try{
            var coll = connection.mongoConn.collection('property');
            coll.find({_id:ObjectID(msg.prop_id)}).toArray(function (err,records) {
                if(err)
                {
                    res = {"statusCode":401,"errMsg":err};
                    tool.logError(err);
                    callback(null, res);
                }
                else {
                    if(records.length>0){
                        res = {"statusCode":200,"prop_array":records};
                        callback(null, res);
                    }
                    else {
                        res = {"statusCode":402,"errMsg":"Sorry there are no matching records in the document"};
                        callback(null, res);
                    }
                }

            });
        }
        catch(err){
            tool.logError(err);
            res = {"statusCode":500,"errMsg":err};
            callback(null, res);
        }

    }
};

function  getPropertyArray(records) {
    var propArray = [];
    for(var i=0;i<records.length;i++){
        propArray.push(records[i]._id);
    }
    return propArray;
}


exports.searchProperty = searchProperty;
exports.listProperty = listProperty;
exports.getPropertyById = getPropertyById;