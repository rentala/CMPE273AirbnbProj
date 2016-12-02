/**
 * Created by Rentala on 19-11-2016.
 */
/**
 * Created by Rentala on 19-11-2016.
 */
var tool = require("../utili/common");
var ObjectId = require('mongodb').ObjectID;
var propertyService = require("./property");
var deleteHost = {

    handle_request : function(connection, msg, callback) {
        var res = {};
        try {
            var coll = connection.mongoConn.collection('users');
            var func = function(err, results) {

                if (err) {
                    tool.logError(err);
                    res.code = 400;
                    callback(null, res);
                } else {
                    res.code=200;
                    //res.result = results;
                    callback(null, res);
                }

            }
            var counter = 2;
            coll.updateOne({_id: new ObjectId(msg.id) }, {$set :{host_status: "NA"}}, func);
            var propColl = connection.mongoConn.collection('property');
            propColl.updateOne({host_id: msg.id }, {$set :{isHostActive: false}}, func);
        } catch (err) {
            res.code = 400;
            tool.logError(err);
            callback(null, res);
        }

    }
};

var reviewUser ={
    handle_request : function(connection, msg, callback) {
        var res = {};
        try {
            var coll = connection.mongoConn.collection('users');
            coll.updateOne({_id: new ObjectId(msg.user_id) }, {$push : { reviews: msg.review}}, function(err, results) {

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

var getHostByCity = {
    handle_request:function (connection,msg,callback) {

        var res = {};

        try{
            var coll = connection.mongoConn.collection('users');
            coll.find({city:msg.city, host_status: "ACCEPTED"}).toArray(function (err,records) {
               if(err){
                   tool.logError(err);
                   res = {"statusCode":400};
                   callback(null,res);
               }
               else{
                   res = {
                       "statusCode":200,
                       "host_dtls": records

                   };
                   callback(null,res);
               }
            });
        }
        catch(err){
            tool.logError(err);
            res = {"statusCode":400};
            callback(null,res);
        }

    }
};

var becomeHost ={
    handle_request : function(connection, msg, callback) {
        var res = {};
        try {
            var coll = connection.mongoConn.collection('users');
            coll.updateOne({_id: new ObjectId(msg.host_id) }, {$set : { host_status : "REQUESTED"}}, function(err, results) {

                if (err) {
                    tool.logError(err);
                    res.code = 400;
                    callback(null, res);
                } else {
                    res.code=200;
                    propertyService.listProperty.handle_request(connection, msg, callback);
                    //res.result = results;
                    //callback(null, res);
                }

            });
        } catch (err) {
            res.code = 400;
            tool.logError(err);
            callback(null, res);
        }

    }
}


exports.getHostByCity = getHostByCity;
exports.deleteHost = deleteHost;
exports.reviewUser = reviewUser;
exports.becomeHost = becomeHost;