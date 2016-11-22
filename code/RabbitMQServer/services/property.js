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
	            var localMsg = JSON.stringify(msg);
	            var coll = connection.mongoConn.collection('property');
                msg.reviews = [];
	            coll.insert(msg, function(err, prop){
	                if(err){
	                    tool.logError(err);
	                    res.code ="400";
	                    callback(null, res);
	                }
	                else
	                {
	                	if(msg.is_auction == "Y"){
	                	var options = {host_min_amt:localMsg.price, max_bid_price: localMsg.price, property_name: localMsg.description,property_id:prop.insertedIds};
	                	mysql.execute_query(function (err,result) {
	                         if(err){
	                        	 tool.logError(err);
	                             res.code ="400";
	                             callback(null, res);
	                         }
	                         else {
                                 res.propertyId = prop.insertedIds;
                                 res.code ="200";
                                 callback(null, res);
	                             }
	                     },sql_queries.INSERT_PRODUCT_IN_BIDDING,options);
	                	}
	                	 else
	                     {
	                		 res.propertyId = prop.insertedIds;
	                         res.code ="200";
	                         callback(null, res);
	                     }
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
            coll.find({city: msg.city,start_date:{$lte:new Date(msg.start_date)},end_date:{$gte:new Date(msg.end_date)},guests:{$gte:msg.guests}}).toArray(function(err, records){
                if(err){
                    res = {"statusCode":400};
                    tool.logError(err);
                    callback(null, res);
                }
                else {
                    console.log(records);
                    if (records.length > 0) {
                        available_property = getPropertyArray(records);
                        mysql.execute_query(function (err, result) {
                            if (err) {
                                tool.logError(err);
                                res = {"statusCode": 400};
                                callback(null, res);
                            }
                            else {
                                console.log(result);
                                if (result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        if ((new Date(msg.start_date)) >= result[i].checkin_date && (new Date(msg.end_date)) <= result[i].checkout_date) {
                                            // Deleting dates within trip dates.
                                            if (i != -1) {
                                                var invalid_property_index = recs.indexOf(result[i].property_id);

                                                if (invalid_property_index != -1) {
                                                    recs.splice(invalid_property_index, 1);
                                                }
                                            }
                                        }
                                    }
                                    valid_property = records;
                                    res = {"statusCode": 200, "valid_property": records};
                                    callback(null, res);
                                }
                                else {
                                    res = {
                                        "statusCode": 401,
                                        "errMsg": "There is no matching property for your query."
                                    };
                                    callback(null, res);
                                }
                            }
                        }, sql_queries.FETCH_TRIP_DATES, [available_property, msg.user_id]);
                    }
                    else {
                        //No Matching Dates.
                        res = {"statusCode": 401};
                        callback(null, res);
                    }
                }
            });
        }
        catch(err)
        {
            tool.logError(err);
            res = {"statusCode":400};
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
                    res = {"statusCode":400};
                    tool.logError(err);
                    callback(null, res);
                }
                else {
                    if(records.length>0){
                        res = {"statusCode":200,"prop_array":records};
                        callback(null, res);
                    }
                    else {
                        res = {"statusCode":401};
                        callback(null, res);
                    }
                }

            });
        }
        catch(err){
            tool.logError(err);
            res = {"statusCode":400};
            callback(null, res);
        }
    }
};

var propList = {
    handle_request:function (connection,msg,callback) {
        var res={};

        try{
            var coll = connection.mongoConn.collection('property');
            coll.find().toArray(function (err,records) {
                if(err)
                {
                    res = {"statusCode":400};
                    tool.logError(err);
                    callback(null, res);
                }
                else {
                    if(records.length>0){
                        res = {"statusCode":200,"prop_array":records};
                        callback(null, res);
                    }
                    else {
                        res = {"statusCode":401};
                        callback(null, res);
                    }
                }
            });
        }
        catch(err){
            tool.logError(err);
            res = {"statusCode":400};
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

exports.propList = propList;
exports.getPropertyArray = getPropertyArray;
exports.searchProperty = searchProperty;
exports.listProperty = listProperty;
exports.getPropertyById = getPropertyById;