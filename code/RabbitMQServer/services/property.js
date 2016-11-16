//add handler functions for property.
var tool = require("../utili/common");

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
