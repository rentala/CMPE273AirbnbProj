var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var ObjectID = require('mongodb').ObjectId;

var view = {
    handle_request: function (connection,msg,callback) {

        var res = {};

        mysql.execute_query(function (err,result) {
            if(err){
                tool.logError(err);
                res = {"statusCode":401};
                callback(null,res);
            }
            else
            {
                if(result.length>0){
                    var coll = connection.mongoConn.collection('property');
                    coll.find({"_id":ObjectID(result[0].property_id)}).toArray(function (err,records) {
                        console.log(records);
                        if(err){
                            tool.logError(err);
                            res = {"statusCode":400};
                            callback(null,res);
                        }
                        else {
                            if(records.length>0)
                            {
                                res = {"statusCode":200,"bill_dtls":result,"property_dtls":records};
                                callback(null,res);
                            }
                            else
                            {
                                res = {"statusCode":401};
                                callback(null,res);
                            }
                        }
                    });
                }
            }
        },sql_queries.FETCH_BILLING_DTLS,[msg.trip_id]);
    }
};

var deleteBill = {
    handle_request:function (connection,msg,callback) {
        var res={};

        mysql.execute_query(function (err,result) {
            if(err){
                tool.logError(err);
                res = {"statusCode":400};
                callback(null,res);
            }
            else {
                res = {"statusCode":200};
                callback(null, res);
            }
        },sql_queries.DELETE_BILL,[msg.bill_id]);
    }
};

exports.deleteBill = deleteBill;
exports.view = view;
