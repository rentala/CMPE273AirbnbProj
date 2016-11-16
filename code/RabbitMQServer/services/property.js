/**
 * Created by Rentala on 15-11-2016.
 */
var tool = require("../utili/common");


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
}

var searchProperty = {
    handle_request : function (connection,msg,callback) {
        var res = {};
        console.log(msg.city);
        try{
            var coll = connection.mongoConn.collection('property');
            coll.find({city: msg.city},function(err, records){
                if(err){
                    tool.logError(err);
                }
                else if (records) {
                    console.log("inside else if");
                    res.code = "200";
                    res.value = records;
                    callback(null, res);
                }
                else {
                    res.code = "400";
                    res.value = id;
                    callback(null, res);
                }
            });
        }
        catch(err)
        {
            res.code = "500";
            callback(null, res);
        }
    }
};

exports.searchProperty = searchProperty;
exports.listProperty = listProperty;
