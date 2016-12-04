/**
 * New node file
 */
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

client.on('connect', function(){
	console.log("Connected");
})

exports.storeJsonInRedis = function(key, jsonArray){
	client.hmset(key, jsonArray);	
}

exports.getJsonFromRedis = function(key, callback){
	client.hgetall(key, function(err, object) {
	    //console.log(object.name);
	    callback(err, object);
	});
}

exports.setInRedis = function(key, value){
	client.set(key, value, redis.print);
}

exports.getFromRedis = function(key, callback){
	client.get(key, function(error, value){
		//console.log('the key for something is = ' + value);
		callback(error, value);
	})
}