
var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var tool = require("../utili/common");
var fs = require('fs');
var d3 = require('d3');



router.post('/topProp',function (req,res) {
    //var no_of_props= req.param("no_of_props");
    var no_of_props= req.body.no_of_props;
    console.log("No of properties : " +no_of_props);
    //var year = req.param("year");
    var year = req.body.year;
    console.log("Year : " +year);
    var json_responses;
    var msg_payload = {"year" : year,"no_of_props":no_of_props};

    mq_client.make_request('top_property_queue',msg_payload,function (err,results) {

        if(err)
        {
      	   tool.logError(err);
            json_responses = {"status_code":400};
        }
        else{
            if(results.statusCode == 200){
            	console.log("An AirbnbClient : ")
                json_responses = {"status_code":results.statusCode,"top_property":results.top_property};
            }
            else{
                json_responses = {"status_code":results.statusCode};
            }
        }
     	console.log("An AirbnbClient : " + JSON.stringify(json_responses));
        res.send(json_responses);
        res.end();
    });

});

router.post('/cityWiseData',function (req,res) {

    var json_responses;
    var city = req.body.city;

    var msg_payload = {"city":city};

    mq_client.make_request('city_wise_data_queue',msg_payload,function (err,results) {

        if(err){
      	   tool.logError(err);
            json_responses = {"status_code":400};
        }
        else {
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"city_wise_data":results.city_wise_data};
            }
            else{
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
    });

});

router.post('/topHost',function (req,res) {
    var no_of_hosts= req.body.no_of_hosts;
    var json_responses;
    var msg_payload = {"no_of_hosts":no_of_hosts};

    mq_client.make_request('top_host_queue',msg_payload,function (err,results) {

        if(err)
        {
      	   tool.logError(err);
            json_responses = {"status_code":400};
        }
        else{
            if(results.statusCode == 200){
                json_responses = {"status_code":results.statusCode,"top_host":results.top_host};
            }
            else{
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();
    });

});

router.get('/propRatings',function (req,res) {
    var host_id = req.session.user._id;
    console.log("In AirbnbClient  : analytics.js  : propRatings : "+host_id);
    var msg_payload = {"host_id":host_id};

    mq_client.make_request('prop_ratings_queue',msg_payload,function (err,results) {
        if(err){
            console.log("In AirbnbClient : analytics.js : Property ratings : Error : " +err);
            tool.logError(err);
            var json_resp = {
                "status_code" : 400
            };
            res.send(json_resp);
            res.end();

        }else{
            res.send(results.json_resp);
            res.end();
        }

    });

});

router.get('/bidInfo',function (req,res) {

    var json_responses;
    var prop_id=req.param("prop_id");
    var msg_payload = {"prop_id":prop_id};

    mq_client.make_request('analytics_bid_info_queue',msg_payload,function (err,results) {

        if(err)
        {
            tool.logError(err);
            json_responses={"status_code":400};
        }
        else
        {
            if(results.statusCode==200){
                json_responses = {"status_code":results.statusCode,"bid_info":results.bid_info};
            }
            else {
                json_responses = {"status_code":results.statusCode};
            }
        }
        res.send(json_responses);
        res.end();

    });

});

router.get('/propertyClicks',function (req,res) {
    var host_id  = req.session.user._id;
    var json_responses;
   fs.readFile("./logs/propClicks.tsv", "utf8", function(error, data) {
       console.log("data"+JSON.stringify(data));
       data = d3.tsvParse(data);
       console.log(JSON.stringify(data));

       var procData=[];
       for(var i =0;i<data.length;i++){
           if(data[i].host_id == host_id)
           {
               console.log("valid property : "+ data[i].property_id);
               console.log("index : "+ i );
               procData.push(data[i]);
           }
       }

       var finalData = d3.nest()
           .key(function(d) { return d.property_name;})
           .rollup(function(d) {
               return d3.sum(d, function(g) {return g.clicks; });
           }).entries(data);

       console.log("Cleaned data : " + JSON.stringify(finalData));
       json_responses = {
           "status_code":200,
           "finalData":finalData
       };
       res.send(json_responses);
       res.end();
    });
});


router.get('/pageClicks',function (req,res) {
    var json_responses;
   fs.readFile("./logs/pageClicks.tsv", "utf8", function (error, data) {
       console.log("data" + JSON.stringify(data));
       data = d3.tsvParse(data);
       console.log(JSON.stringify(data));

       var procData = d3.nest()
           .key(function (d) {
               return d.Page;
           })
           .rollup(function (v) {
               return v.length
           }).entries(data);

       console.log("Cleaned data : " + JSON.stringify(procData));

       json_responses={
           "status_code":200,
           "finalData":procData
       };

       res.send(json_responses);
       res.end();
   });
});

router.get('/userTrace',function (req,res) {
    //var prop_id = req.param("prop_id");
    var host_id = req.session.user._id;
    //var prop_id = 1;
   fs.readFile("./logs/userTrace.tsv", "utf8", function (error, data) {
      var procData = d3.tsvParse(data);
       console.log("data to be changed: " + JSON.stringify(procData[0].user_id));
       console.log(JSON.stringify((procData)));
       console.log("array size"+ procData.length);

       var finalData=[];
       for(var i =0;i<procData.length;i++){
           if(procData[i].host_id == host_id)
           {
               console.log("valid property : "+ procData[i].property_id);
               console.log("index : "+ i );
               finalData.push(procData[i]);
           }
       }
       console.log("changed data : "+JSON.stringify(finalData));

       /*var procData = d3.nest()
           .key(function (d) {
               return d.User_id;
           }).entries(data);*/

       res.send(finalData.reverse());
       res.end();
   });
});

router.get('/biddingTrace',function (req,res) {
    var host_id = req.session.user._id;
    //var host_id=1;
   fs.readFile("./logs/biddingTrace.tsv", "utf8", function (error, data) {
       var procData = d3.tsvParse(data);
       console.log(JSON.stringify(procData));

       var finalData=[];
       for(var i =0;i<procData.length;i++){
           if(procData[i].host_id == host_id)
           {
               console.log("valid property : "+ procData[i].property_id);
               console.log("index : "+ i );
               finalData.push(procData[i]);
           }
       }
       console.log("changed data : "+JSON.stringify(finalData));


       /*var procData = d3.nest()
           .key(function (d) {
               return d.Property_Id;
           }).entries(data);*/

       res.send(finalData.reverse());
       res.end();
   });
});


module.exports =router;
