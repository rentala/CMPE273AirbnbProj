var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');

var inbox = {
	handle_request : function (connection,msg,callback) {
        var res = {};
        mysql.execute_query(function (err, result) {
            if(err){
                res = {"statu_code":403,"errMsg":err};
                tool.logError(err);
                //callback(null, res);
            }
            else {
                res = {
                	"status_code":200,
                	"results" : result
            	};
                //callback(null, res);
            }
        },sql_queries.INBOX,[msg.host_id]);

        var coll = connection.mongoConn.collection('user');

		console.log("In RabbitMQ Server : admin.js : host_id : " + msg.host_id);
		var searchCriteria = {
			"_id" : ObjectID(msg.host_id)
		};

		coll.findOne(searchCriteria, function(err, results) {

			if (err){
				
			}
			else{
				
			}
		}
    }
}