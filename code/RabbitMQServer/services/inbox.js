var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var ObjectID = require('mongodb').ObjectID;

var inbox = {
	handle_request : function (connection,msg,callback) {
        var res = {};
        var userDetails;
        var coll = connection.mongoConn.collection('users');

		console.log("In RabbitMQ Server : admin.js : host_id : " + msg.host_id);
		var searchCriteria = {
			"_id" : ObjectID(msg.host_id)
		};

		coll.findOne(searchCriteria, function(err, results) {
			if (err){
				throw err;
			}
			else{
				userDetails = results;
			}
		})
		console.log("userDetails = " + userDetails);
        mysql.execute_query(function (err, result) {
            if(err){
                res = {
                	"status_code":403,
                	"errMsg":err
                };
                tool.logError(err);
            }
            else {
            	console.log("mysql results = " + JSON.stringify(result));
                res = {
                	"status_code":200,
                	"results" : result,
                	"userDetails" : userDetails
            	};
            }
            callback(null, res);
        },sql_queries.INBOX,[msg.host_id]);
    }
}
exports.inbox = inbox;