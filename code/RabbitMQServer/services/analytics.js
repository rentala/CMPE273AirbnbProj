var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var property = require('./property');
var ObjectID = require('mongodb').ObjectId;
var d3 = require('d3');


var topProp = {
    handle_request: function (connection,msg,callback) {
        var res={};
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
               	
               	 var top_prop_data = d3.nest()
               	  .key(function(d) { return d.trip_year; })
               	  .entries(result);
               	 
                   res = {"statusCode":200,"top_property":top_prop_data};
                   callback(null, res);
                }
                else{
                    res = {"statusCode":401};
                    callback(null,res);
                }
            }
        },sql_queries.FETCH_TOP_PROP,no_of_props);
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
                      city_wise_property = getPropertyIds(records);
                     // console.log("Property_id : " + JSON.stringify(city_wise_property));
                      mysql.execute_query(function (err,result) {
                          if(err){
                              res = {"statusCode":400};
                              tool.logError(err);
                              callback(null,res);
                          }
                          else {
                              res = {"statusCode":200,"city_wise_data":result};
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
	for(record in records){
		console.log("Record : " +JSON.stringify(record));
		data.push(record);
	}
	return data;
}

var topHost = {
    handle_request: function (connection,msg,callback) {
        var res={};
        mysql.execute_query(function (err,result) {
            if(err){
                res = {"statusCode":400};
                tool.logError(err);
                callback(null, res);
            }
            else {
                if(result.length>0){
                    res = {"statusCode":200,"top_host":result};
                    callback(null, res);
                }
                else{
                    res = {"statusCode":401};
                    callback(null,res);
                }
            }
        },sql_queries.FETCH_TOP_HOST,[msg.no_of_hosts]);
    }
};

var propertyRatings = {

    handle_request : function(connection, msg, callback) {
        var res = {};
        var json_resp = {};
        try {

            var coll = connection.mongoConn.collection('property');

            console.log("In RabbitMQ Server : admin.js : propertyRatings : property_id : " + msg.property_id);

            var searchCriteria = {
                "_id" : ObjectID(msg.property_id)
            };
            var projection_para = {'_id' : 0 ,'ratings' : 1};

            coll.find(searchCriteria,projection_para).toArray(function(err, propertyRatings) {

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
                    if (propertyRatings.length>0) {
                        json_resp = {
                            "status_code" : 200,
                            "property_ratings_dtls" : propertyRatings[0].ratings
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