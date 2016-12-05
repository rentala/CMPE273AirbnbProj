/**
 * Created by Rentala on 15-11-2016.
 */
var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var ObjectID = require('mongodb').ObjectID;
var listProperty = {
	handle_request : function (connection, msg, callback){
		try{
			var res = {};
			var localMsg = JSON.stringify(msg);
			var coll = connection.mongoConn.collection('property');
			msg.reviews = [];
			coll.insert(msg, function(err, prop){
				if(err){
					tool.logError(err);
					res.code ="400";
					callback(null, res);
				}
				else
				{
					if(msg.is_auction == true){
						console.log("property_id"+prop.insertedIds[0]);
						var options = {host_min_amt:msg.bid_price, max_bid_price: msg.bid_price, property_name: msg.property_title,property_id:prop.insertedIds[0]};
						mysql.execute_query(function (err,result) {
							if(err){
								tool.logError(err);
								res.code ="400";
								callback(null, res);
							}
							else {
								res.propertyIds = prop.insertedIds;
								res.code ="200";
								callback(null, res);
							}
						},sql_queries.INSERT_PRODUCT_IN_BIDDING,options);
					}
					else
					{
						res.propertyIds = prop.insertedIds;
						res.code ="200";
						callback(null, res);
					}
				}
			});
		}
		catch(err){
			tool.logError(err);
			res.statusCode = "500";
			callback(null, res);
		}
	}
};

var searchProperty = {
	handle_request: function (connection, msg, callback) {
		var res = {};
		var available_property = [];
		var valid_property = [];
		try {
			var coll = connection.mongoConn.collection('property');
			var user_start_date = new Date(msg.start_date);
			user_start_date= new Date(user_start_date.getTime() + user_start_date.getTimezoneOffset()*60000);
			var user_end_date = new Date(msg.end_date);
			user_end_date= new Date(user_end_date.getTime() + user_end_date.getTimezoneOffset()*60000);

			coll.find({
				"address.city": msg.city,
				start_date: {$lte: msg.start_date},
				end_date: {$gte: msg.end_date},
				guests: {$gte: msg.guests},
				host_id: {$ne:msg.user_id},
				host_status: "ACCEPTED"
			}).toArray(function (err, records) {
				if (err) {
					res = {"statusCode": 400};
					tool.logError(err);
					callback(null, res);
				}
				else {
					console.log("Valid property records : " + records);
					if (records.length > 0) {
						available_property = getPropertyArray(records);
						if (available_property.length > 0) {
							mysql.execute_query(function (err, result) {
								if (err) {
									tool.logError(err);
									res = {"statusCode": 400};
									callback(null, res);
								}
								else {
									console.log("Trips for valid properties : " + JSON.stringify(result));
									//result is from mysql - trip data
									if (result.length > 0) {
										//Iterate the array of the valid trips
										for (var i = 0; i < result.length; i++) {
											//Get checkin and checkout dates for each trip
											var prop_index = available_property.indexOf(result[i].property_id);
											if (prop_index == -1) {
												console.log("Valid property to consider!!! : " + result[i].property_id);
												var checkIn = new Date(result[i].checkin_date);
												var checkOut = new Date(result[i].checkout_date);
												console.log("user start date : " + user_start_date);
												console.log("user end date : " + user_end_date);
												console.log("CI : " + checkIn);
												console.log("CO : " + checkOut);
												if (!((user_start_date < checkIn && user_end_date < checkIn) || (user_start_date > checkOut && user_end_date > checkOut))) {
													//available_property array of property IDs
													// Deleting dates within trip dates.
													records.splice(prop_index, 1);
													available_property.splice(prop_index, 1);

												}
											}
										}
										valid_property = records;
										if (valid_property.length > 0) {
											res = {
												"statusCode": 200, "valid_property": valid_property, "msg": msg
											};
											callback(null, res);
										}
										else {
											res = {
												"statusCode": 401, "msg": msg
											};
											callback(null, res);
										}
									}
									else {
										res = {
											"statusCode": 200, "valid_property": records, "msg": msg
										};
										callback(null, res);
									}
								}
							}, sql_queries.FETCH_TRIP_DATES, [available_property]);
						}
						else{
							res = {
								"statusCode": 401,"msg":msg
							};
							callback(null, res);
						}
					}
					else {
						//No Matching Dates.
						res = {"statusCode": 401,"msg":msg};
						callback(null, res);
					}
				}
			});
		}
		catch (err) {
			tool.logError(err);
			res = {"statusCode": 400};
			callback(null, res);
		}
	}
};

var getPropertyById = {
	handle_request: function (connection, msg, callback) {
		var res = {};

		try{
			var coll = connection.mongoConn.collection('property');
			coll.findOne({_id:ObjectID(msg.prop_id)}, function (err,prop) {
				if(err)
				{
					res = {"statusCode":400};
					tool.logError(err);
					callback(null, res);
				}
				else {
					if(prop != null && prop.is_auction){
						mysql.execute_query(function (err,result) {
							if(err){
								tool.logError(err);
								res = {"statusCode":401};
								callback(null,res);
							}
							else
							{
								if(result && result.length > 0){
									res = {"statusCode":200,"prop":prop ,"bidding":result};
									callback(null, res);

								}
								else{
									res = {"statusCode":200,"prop":prop ,"bidding":[]};
									callback(null, res);
								}
							}
						},sql_queries.FETCH_MAX_BID,[msg.prop_id]);
					}
					else {
						res = {"statusCode":200,"prop":prop };
						callback(null, res);
					}
				}

			});
		}
		catch(err){
			tool.logError(err);
			res = {"statusCode":400};
			callback(null, res);
		}
	}
};

var propList = {
	handle_request:function (connection,msg,callback) {
		var res={};

		try{
			var coll = connection.mongoConn.collection('property');
			coll.find().toArray(function (err,records) {
				if(err)
				{
					res = {"statusCode":400};
					tool.logError(err);
					callback(null, res);
				}
				else {
					if(records.length>0){
						res = {"statusCode":200,"prop_array":records};
						callback(null, res);
					}
					else {
						res = {"statusCode":401};
						callback(null, res);
					}
				}
			});
		}
		catch(err){
			tool.logError(err);
			res = {"statusCode":400};
			callback(null, res);
		}
	}
};

function  getPropertyArray(records) {
	var propArray = [];
	console.log(new Date());

	for(var i=0;i<records.length;i++){
		console.log(new Date(records[i].auction_expiry_date));
		if(records[i].is_auction && new Date(records[i].auction_expiry_date) < new Date()){

		}
		else {
			propArray.push(records[i]._id);
		}
	}
	return propArray;
}
var bidProperty = {
	handle_request: function (connection, msg, callback) {
		var res = {};
		console.log("MESSAGE = " + JSON.stringify(msg));

		mysql.execute_query(function(err, result){
			if(err){
				console.log("err"+ err);
				res = {"statusCode" : 401, "errMsg" : err};
				callback(null, res);
			}
			else{
				console.log("success");
				res = {"statusCode" : 200};
				callback(null, res);
			}
		}, sql_queries.INSERT_BID, [msg.bid_id, msg.user_id, msg.bid_amount, msg.property_id,msg.property_name,msg.bidder_name]);
	}
};


var myListings = {
	handle_request : function (connection,msg,callback) {
		var res = {};
		try{
			var coll = connection.mongoConn.collection('property');

			coll.find({"host_id" :msg.host_id}).toArray(function(err, records){
				if(err){
					res = {"statusCode":400};
					tool.logError(err);
					callback(null, res);
				}
				else {
					if(records.length>0){
						res = {"statusCode":200, records:records};
						//tool.logError(err);
						callback(null, res);
					}
					else{
						res = {"statusCode":401};
						callback(null, res);
					}
				}
			});
		}
		catch(err)
		{
			tool.logError(err);
			res = {"statusCode":400};
			callback(null, res);
		}
	}
};

exports.propList = propList;
exports.getPropertyArray = getPropertyArray;
exports.searchProperty = searchProperty;
exports.listProperty = listProperty;
exports.getPropertyById = getPropertyById;
exports.bidProperty = bidProperty;
exports.myListings = myListings;