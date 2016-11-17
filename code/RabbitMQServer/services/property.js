/**
 * Created by Rentala on 15-11-2016.
 */
var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var listProperty = {
    handle_request : function (connection, msg, callback){
        try{
            var res = {};
            var coll = connection.mongoConn.collection('property');
            coll.insert(msg, function(err, user){
                if(err){
                    tool.logError(err);
                    res.code ="400";
                    callback(null, res);
                }
                else
                {
                    res.user_id = user.insertedIds,
                        res.first_nm = user.first_name ;
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
        try{
            var coll = connection.mongoConn.collection('property');
            coll.find({city: msg.city,state:msg.state,zipcode:msg.zipcode,category:msg.category,start_date:{$lte:new Date(msg.start_date)},end_date:{$gte:new Date(msg.end_date)}},function(err, records){
                if(err){
                    res.code = "400";
                    tool.logError(err);
                    callback(null, res);
                }
                records.toArray(function (e,recs) {
                    console.log(recs);
                    if (recs){
                        available_property = getPropertyArray(recs);
                        mysql.fetchTripDates(function (err, result) {
                            if(err){
                                throw err;
                            }
                            else {
                                if(result.length>0){
                                    res.code = "200";
                                    res.value = result;
                                    callback(null, res);
                                }
                                else {
                                    res.code = "400";
                                    callback(null, res);
                                }
                            }
                        },sql_queries.FETCH_TRIP_DATES,[available_property]);
                    }
                    else {
                        res.code = "400";
                        callback(null, res);
                    }
                });

            });
        }
        catch(err)
        {
            tool.logError(err);
            res.code = "500";
            callback(null, res);
        }
    }
};

function  getPropertyArray(records) {
    var propArray = [];
    for(var i=0;i<records.length;i++){
        propArray.push(records[i]._id);
    }
    console.log(propArray);
    return propArray;
}


exports.searchProperty = searchProperty;
exports.listProperty = listProperty;
