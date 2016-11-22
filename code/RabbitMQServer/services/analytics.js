var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var property = require('./property');

var topProp = {
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
                    res = {"statusCode":200,"top_property":result};
                    callback(null, res);
                }
                else{
                    res = {"statusCode":401};
                    callback(null,res);
                }
            }
        },sql_queries.FETCH_TOP_PROP,msg.no_of_props);
    }
};

var cityWiseData = {
  handle_request: function (connection,msg,callback) {
      var res={};
      var city_wise_property = [];

      try{
          var coll=connection.mongoConn.collection('property');
          coll.find({"city":msg.city}).toArray(function (err, records) {
              if(err){
                  res = {"statusCode":400};
                  tool.logError(err);
                  callback(null,res);
              }
              else {
                  if(records.length>0){
                      city_wise_property = property.getPropertyArray(records);
                      console.log(city_wise_property);
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


exports.propertyRatings = propertyRatings;
exports.topProp = topProp;
exports.cityWiseData = cityWiseData;
exports.topHost = topHost;