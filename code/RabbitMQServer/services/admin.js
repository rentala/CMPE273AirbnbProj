//Reabbit MQ server side for handling the admin related services
var tool = require("../utili/common");
var ObjectID = require('mongodb').ObjectId;

var approveHost = {

	handle_request : function(connection, msg, callback) {
		var res = {};
		var json_resp = {};
		try {

			var coll = connection.mongoConn.collection('users');

			console.log("In RabbitMQ Server : admin.js : host_id : " + msg.host_id);
			var searchCriteria = {
				"_id" : ObjectID(msg.host_id)
			};
			var data = {
					$set : {		
						"host_status" : "ACCEPTED"
					}
			};

			coll.updateOne(searchCriteria, data , function(err, results) {

				if (err) {
					console.log("RabbitMQ server : admin.js : error :"+err);
					tool.logError(err);
					json_resp = {
						"status_code" : 400
					};
					res = {
						"json_resp" : json_resp
					};
					callback(null, res);
				} else {
					console.log("Record after updating the host status : " + JSON.stringify(results));
					if (results.modifiedCount == 1) {
						json_resp = {
							"status_code" : 200
						};
					} else {
						console.log("RabbitMQ server : admin.js : No erro but record was not updated : host_id : " +msg.host_id);
						json_resp = {
							"status_code" : 401
						};
					}
					res = {
						"json_resp" : json_resp
					};
					callback(null, res);
				}

			});
		} catch (err) {
			tool.logError(err);
			json_resp = {
				"status_code" : 400,
			};
			res = {
				"json_resp" : json_resp
			};
			callback(null, res);
		}

	}
};

var pendingHostsForApproval = {

		handle_request : function(connection, msg, callback) {
			var res = {};
			var json_resp = {};
			try {

				var coll = connection.mongoConn.collection('users');

				console.log("In RabbitMQ Server : admin.js : pendingHostsForApproval : city : " + msg.city);
				console.log("In RabbitMQ Server : admin.js : pendingHostsForApproval : host_status : " + msg.host_status);
				var searchCriteria = {
					"city" : msg.city,
					"host_status" : msg.host_status
				};
			
				coll.find(searchCriteria).toArray(function(err, userDtls) {
					
					if (err) {
						console.log("RabbitMQ server : admin.js : pendingHostsForApproval : error :"+err);
						tool.logError(err);
						json_resp = {
							"status_code" : 400
						};
						res = {
							"json_resp" : json_resp
						};
						callback(null, res);
					} else {
						if (userDtls) {
							json_resp = {
								"status_code" : 200,
								"userDtls" : userDtls
							};
						} else {
							console.log("RabbitMQ server : admin.js : No record to fetch");
							json_resp = {
								"status_code" : 401
							};
						}
						res = {
							"json_resp" : json_resp
						};
						callback(null, res);
					}
				});

			} catch (err) {
				tool.logError(err);
				json_resp = {
					"status_code" : 400
				};
				res = {
					"json_resp" : json_resp
				};
				callback(null, res);
			}

		}
	};

var checkLogin = {
	handle_request: function(connection, msg, callback) {
		console.log("reached checkLogin");
		var res = {};
		var json_resp = {};
		console.log(msg);
		
		if(msg.email == "admin" && msg.password == "admin"){
			res.statusCode = 200;
			res.message = "Success";
			res.adminEmailId = msg.email;
			console.log("response message = " + res.message);
	    	callback(null, res);
		}
		else{
			res.statusCode = 400;
			res.message = "Username or Password is wrong!";
			console.log("response message = " + res.message);
			callback(null, res);
		}
	}
}

exports.pendingHostsForApproval = pendingHostsForApproval;
exports.approveHost = approveHost;
exports.checkLogin = checkLogin;