//super simple rpc server example
var amqp = require('amqp'),
	util = require('util'),
	mongoURL = "mongodb://localhost:27017/airbnb",
	mongo = require("./db/mongo"),
	cnn = amqp.createConnection({host:'127.0.0.1'}),
	mysql = require("./db/mysql.js"),
	connMgr = new mysql.connectionManager(500);

var auth = require('./services/authentication');
var profile = require('./services/profile');
var mongoConn;
var connection = { mongoConn: mongoConn, sqlConn: connMgr  };
mongo.connect(mongoURL, function(db){
	mongoConn = db;
	connection = { mongoConn: mongoConn, sqlConn: connMgr  }
	console.log('Connected to mongo at: ' + mongoURL);
});


cnn.on('ready', function(){
	console.log("listening on all queues");

	cnn.queue('login_queue', function(q){
		subscriber(q, auth.login );
	});
	// registration queue
	cnn.queue('register_queue', function(q){
		subscriber(q, auth.register );
	});
	
	cnn.queue('update_profile_queue', function(q){
		subscriber(q, profile.updateProfile );
	});
	cnn.queue('userinfo_queue', function(q){
		subscriber(q, profile.userInfo );
	});
});

var subscriber = function(q, module){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		module.handle_request(connection, message, function(err,res){
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
}
