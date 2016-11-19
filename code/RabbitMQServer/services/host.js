/**
 * Created by Rentala on 19-11-2016.
 */
var tool = require("../utili/common");
var ObjectId = require('mongodb').ObjectID;

var deleteHost = {

    handle_request : function(connection, msg, callback) {
        var res = {};
        try {
            var coll = connection.mongoConn.collection('users');
            coll.updateOne({_id: new ObjectId(msg.id) }, {$set :{is_host: "N"}}, function(err, results) {

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
};

exports.deleteHost = deleteHost;