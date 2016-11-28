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
        mysql.execute_query(function (err, result) {
            if(err){
                res = {
                	"status_code":400,
                	"errMsg":err
                };
                tool.logError(err);
                callback(null, res);
            }
            else {
            	var coll = connection.mongoConn.collection('property');
            	coll.find({
	                host_id: msg.host_id}).toArray(function (err, records) {
	                if (err) {
	                	res = {
			                	"status_code":200,
			                	"results" : result,
			                	"biddings" : []
			            	};
                        callback(null, res);
	                }
	                else {
	                	console.log("Valid property records : " + records);
	                    if (records.length > 0) {
	                        available_property = getPropertyArray(records);
			            	console.log("properties " + available_property);
			            	mysql.execute_query(function (err, results) {
			               console.log("results"+JSON.stringify(results));
			               if (err) {
			                	res = {
					                	"status_code":200,
					                	"results" : result,
					                	"biddings" : []
					            	};
		                        callback(null, res);
			                }
			               else{
				               res = {
				                	"status_code":200,
				                	"results" : result,
				                	"biddings" : results
				            	};
				                callback(null, res);
			            	}
			            	 },sql_queries.FETCH_BID_WINNERS,[available_property]);
	                    }
	                    else {
	                    	console.log("no properties " );
	                    	res = {
				                	"status_code":200,
				                	"results" : result,
				                	"biddings" : []
				            	};
	                        callback(null, res);
	                    }
	                } 
	            }); 
            }
        },sql_queries.INBOX,[msg.host_id]);
    }
}
        
function  getPropertyArray(records) {
    var propArray = [];
    for(var i=0;i<records.length;i++){
        propArray.push(records[i]._id);
    }
    return propArray;
}        
exports.inbox = inbox;