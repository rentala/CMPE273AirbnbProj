//Reabbit MQ server side for handling the admin related services
var tool = require("../utili/common");
var ObjectID = require('mongodb').ObjectId;
var mysql = require('../db/mysql');
var sql_queries = require('../db/sql_queries');
var redis = require('../db/redis');

var approveHost = {

	handle_request : function(connection, msg, callback) {
		var res = {};
		var json_resp = {};
		try {

			var coll = connection.mongoConn.collection('users');
			var productsColl = connection.mongoConn.collection('property');

			console.log("In RabbitMQ Server : admin.js : host_id : " + msg.host_id);
			var searchCriteria = {
				"_id" : ObjectID(msg.host_id)
			};
			var data = {
					$set : {		
						"host_status" : "ACCEPTED"
					}
			};
			var callBackCount = 0;
			coll.updateOne(searchCriteria, data , function(err, results) {
				callBackCount++;
				if (err) {
					console.log("RabbitMQ server : admin.js : error :"+err);
					tool.logError(err);
					json_resp = {
						"status_code" : 400
					};
					res = {
						"json_resp" : json_resp
					};

					if(callBackCount == 2){
						callback(null, res);
					}

				}
				else {
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
					if(callBackCount == 2){
						callback(null, res);
					}
					//callback(null, res);
				}

			});
			productsColl.updateMany({"host_id": msg.host_id},data, function (err, results) {

				callBackCount++;
				if (err) {
					console.log("RabbitMQ server : admin.js : error :"+err);
					tool.logError(err);
					json_resp = {
						"status_code" : 400
					};
					res = {
						"json_resp" : json_resp
					};

					if(callBackCount == 2){
						callback(null, res);
					}

				}
				else {
					console.log("Record after updating the host status in products : " + JSON.stringify(results));
					if (results.modifiedCount > 0) {
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
					if(callBackCount == 2){
						callback(null, res);
					}
					//callback(null, res);
				}
			})
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

var rejectHost = {
	handle_request : function(connection, msg, callback) {
		console.log("reached rejecting");
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
						"host_status" : "REJECTED"
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

		mysql.execute_query(function (err,result) {
            if(err){
                tool.logError(err);
                res = {"statusCode":400};
                callback(null,res);
            }
            else{
                if(result.length>0){
                	if(result[0].password == msg.password){
	                    res.statusCode = 200;
						res.message = "Success";
						res.adminDetails = result;
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
                else{
                    res.statusCode = 400;
					res.message = "No Such Admin Exists";
					console.log("response message = " + res.message);
					callback(null, res);
                }
            }
        },sql_queries.FETCH_ADMIN_DETAILS, [msg.email]);

		/*if(msg.password == 'admin' && msg.email == 'admin'){
			res.statusCode = 200;
			res.message = "Success";
			res.adminEmailId = msg.email;
			console.log("response message = " + res.message);
			callback(null, res);
		} else{
			res.statusCode = 400;
			res.message = "Username or Password is wrong!";
			console.log("response message = " + res.message);
			callback(null, res);
		}*/
	}
};

var getAllBills = {
    handle_request: function (connection,msg,callback) {
        var res = {};
        var refineCriteria = msg.refineCriteria;
        var date = msg.date;
        var month = msg.month;
        var year = msg.year;
        //var query = "SELECT * FROM airbnb.trip, airbnb.billing where trip.trip_id = billing.trip_id and (date(trip.trip_approved_time)) = (date('" + date + "')) and bill_status != 'DELETED';"
        //console.log("query is = " + query);
		if(refineCriteria == "date"){
			console.log(date);
			mysql.execute_query(function (err,result) {
	            if(err){
	                tool.logError(err);
	                res = {"statusCode":400};
	                callback(null,res);
	            }
	            else{
	                if(result.length>0){
	                    res = {
	                        "statusCode": 200,
	                        bills: result
	                    };
	                    callback(null,res);
	                }
	                else{
	                    res = {"statusCode":401};
	                    callback(null,res);
	                }
	            }
	        },sql_queries.FETCH_ALL_BILLS_BY_DATE, [date]);
		}

		else if(refineCriteria == "month"){
			console.log(month);
			mysql.execute_query(function (err,result) {
	            if(err){
	                tool.logError(err);
	                res = {"statusCode":400};
	                callback(null,res);
	            }
	            else{
	                if(result.length>0){
	                    res = {
	                        "statusCode": 200,
	                        bills: result
	                    };
	                    callback(null,res);
	                }
	                else{
	                    res = {"statusCode":401};
	                    callback(null,res);
	                }
	            }
	        },sql_queries.FETCH_ALL_BILLS_BY_MONTH,[month]);
		}

		else if(refineCriteria == "year"){
			console.log(year);
			mysql.execute_query(function (err,result) {
	            if(err){
	                tool.logError(err);
	                res = {"statusCode":400};
	                callback(null,res);
	            }
	            else{
	                if(result.length>0){
	                    res = {
	                        "statusCode": 200,
	                        bills: result
	                    };
	                    callback(null,res);
	                }
	                else{
	                    res = {"statusCode":401};
	                    callback(null,res);
	                }
	            }
	        },sql_queries.FETCH_ALL_BILLS_BY_YEAR,[year]);
		}
	}
};

exports.getAllBills = getAllBills;
exports.pendingHostsForApproval = pendingHostsForApproval;
exports.approveHost = approveHost;
exports.checkLogin = checkLogin;
exports.rejectHost = rejectHost;