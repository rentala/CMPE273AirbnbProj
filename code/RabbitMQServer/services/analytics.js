var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var property = require('./property');
var ObjectID = require('mongodb').ObjectId;
var d3 = require('d3');


var topProp = {
    handle_request: function (connection,msg,callback) {
        var res={};
        var year = msg.year;
        var no_of_props = parseInt(msg.no_of_props);
        console.log("No of properties : " + no_of_props);
        mysql.execute_query(function (err,result) {
            if(err){
                res = {"statusCode":400};
                tool.logError(err);
                callback(null, res);
            }
            else {
                if(result.length>0){
               	
               	 /*var top_prop_data = d3.nest()
               	  .key(function(d) { return d.trip_year; })
               	  .entries(result);*/
               		var formattedData = [];
               		
               		for(var i in result){
               			var changedObj = {};
               			changedObj.key = result[i].property_name;
               			changedObj.value = result[i].revenue;
               			formattedData.push(changedObj);
               		}
                   res = {"statusCode":200,"top_property":formattedData};
                   callback(null, res);
                }
                else{
                    res = {"statusCode":401};
                    callback(null,res);
                }
            }
        },sql_queries.FETCH_TOP_PROP,[year,no_of_props]);
    }
};



var cityWiseData = {
  handle_request: function (connection,msg,callback) {
      var res={};
      var city_wise_property = [];

      try{
          var coll=connection.mongoConn.collection('property');
          coll.find({"address.city":msg.city},{'_id':1}).toArray(function (err, records) {
              if(err){
                  res = {"statusCode":400};
                  tool.logError(err);
                  callback(null,res);
              }
              else {
                  if(records.length>0){
                  	console.log("Property Ids for given city : " + JSON.stringify(records));
                      city_wise_property = getPropertyIds(records);
                     // console.log("Property_id : " + JSON.stringify(city_wise_property));
                      mysql.execute_query(function (err,result) {
                          if(err){
                              res = {"statusCode":400};
                              tool.logError(err);
                              callback(null,res);
                          }
                          else {
                        	  console.log("Property details : " + JSON.stringify(result));
                        	  var formattedData = [];
                       		
                          		for(var i in result){
                          			var changedObj = {};
                          			changedObj.key = result[i].trip_year;
                          			changedObj.value = result[i].total_revenue;
                          			formattedData.push(changedObj);
                          		}
                              res = {"statusCode":200,"city_wise_data":formattedData};
                              callback(null,res);
                          }
                      },sql_queries.FETCH_CITY_WISE_DATA,[city_wise_property]);
                  }else {
                      res = {"statusCode":401};
                      callback(null,res);
                  }
              }
          });
      }
      catch (err){
          res = {"statusCode":400};
          tool.logError(err);
          callback(null,res);
      }
  }
};


function getPropertyIds(records){
	var data = [];
	for(var i in records){
		//console.log("Record : " +JSON.stringify(record));
		data.push(records[i]._id);
	}
	return data;
}

var topHost = {
    handle_request: function (connection,msg,callback) {
        var res={};
        
        var no_of_hosts = parseInt(msg.no_of_hosts);
        mysql.execute_query(function (err,result) {
            if(err){
                res = {"statusCode":400};
                tool.logError(err);
                callback(null, res);
            }
            else {
                if(result.length>0){
               	  var formattedData = [];
                		
                		for(var i in result){
                			var changedObj = {};
                			changedObj.key = result[i].host_name;
                			changedObj.value = result[i].total_revenue;
                			formattedData.push(changedObj);
                		}
                    res = {"statusCode":200,"top_host":formattedData};
                    callback(null, res);
                }
                else{
                    res = {"statusCode":401};
                    callback(null,res);
                }
            }
        },sql_queries.FETCH_TOP_HOST,[no_of_hosts]);
    }
};

var propertyRatings = {

    handle_request : function(connection, msg, callback) {
        var res = {};
        var json_resp = {};
        try {

            var coll = connection.mongoConn.collection('property');

            console.log("In RabbitMQ Server : admin.js : propertyRatings : host_id : " + msg.host_id);

            var searchCriteria = {
                "host_id" : ObjectID(msg.host_id)
            };
            var projection_para = {'_id' : 1 ,'property_name':1,'ratings' : 1};

            coll.find(searchCriteria,projection_para).toArray(function(err, results) {

                if (err) {
                    console.log("RabbitMQ server : analytics.js : propertyRatings : error :"+err);
                    //tool.logError(err);
                    json_resp = {
                        "status_code" : 400
                    };
                    res = {
                        "json_resp" : json_resp
                    };
                    callback(null, res);
                } else {
               	 console.log("Property rating records : " + JSON.stringify(results));
                    if (results.length>0) {
                  	  console.log("Property rating records : " + JSON.stringify(results));
                  	  property_ratings = calculateAverageRating(results);
                  	
                        json_resp = {
                            "status_code" : 200,
                            "property_ratings_dtls" : property_ratings
                        };
                    } else {
                        console.log("RabbitMQ server : analytics.js :propertyRatings: No record to fetch");
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

var calculateAverageRating= function(results){
	
	var avgPropRaating = [];
	//For each property
	for(var index in results){
		var property = results[index];
		console.log("Property details : " +JSON.stringify(property));
		var prop ={};
		//prop.prop_id = property._id;
		console.log("Property ID : " +prop.id);
		prop.key = property.property_name;
		var avg_rating = 0;
		
		//For each rating in a property
		for(var i in property.ratings){
			//Calculate the sum of all the ratings
			avg_rating +=parseInt(property.ratings[i].rating_stars);
		}
		//Calculate the average
		avg_rating = avg_rating/property.ratings.length;
		console.log("Average Ratings : " + avg_rating);
		
		prop.value = avg_rating;
		avgPropRaating.push(prop);
	}
	return avgPropRaating;
};

var bidInfo = {
    handle_request:function (connection, msg, callback) {
        var res = {};

        mysql.execute_query(function (err,result) {
            if(err) {
                res = {"statusCode": 400};
                tool.logError(err);
                callback(null, res);
            }
            else{
                if(result.length>0){
                    res = {"statusCode":200,"bid_info":result};
                    callback(null, res);
                }
                else {
                    res = {"statusCode":401};
                    callback(null,res);
                }
            }
        },sql_queries.FETCH_BID_INFO,[msg.prop_id]);
    }
};

exports.bidInfo = bidInfo;
exports.propertyRatings = propertyRatings;
exports.topProp = topProp;
exports.cityWiseData = cityWiseData;
exports.topHost = topHost;