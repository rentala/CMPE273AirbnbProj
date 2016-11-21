var tool = require("../utili/common");
var sql_queries = require('../db/sql_queries');
var mysql = require('../db/mysql');
var property = require('./property');

//Test -Varsha/Pranjal
var topProp = {
    handle_request: function (connection,msg,callback) {
        var res={};
        mysql.execute_query(function (err,result) {
            if(err){
                res = {"statusCode":401};
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
                  res = {"statusCode":401};
                  tool.logError(err);
                  callback(null,res);
              }
              else {
                  if(records.length>0){
                      city_wise_property = property.getPropertyArray(records);
                      console.log(city_wise_property);
                      mysql.execute_query(function (err,result) {
                          if(err){
                              res = {"statusCode":402};
                              tool.logError(err);
                              callback(null,res);
                          }
                          else {
                              res = {"statusCode":200,"city_wise_data":result};
                              callback(null,res);
                          }
                      },sql_queries.FETCH_CITY_WISE_DATA,[city_wise_property]);
                  }else {
                      res = {"statusCode":403};
                      callback(null,res);
                  }
              }
          });
      }
      catch (err){
          res = {"statusCode":500};
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
                res = {"statusCode":401};
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



exports.topProp = topProp;
exports.cityWiseData = cityWiseData;
exports.topHost = topHost;