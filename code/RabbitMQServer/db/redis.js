/**
 * New node file
 */
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

client.on('connect', function(){
	console.log("Connected");
})
//client.set("email", "admin", redis.print);
client.set("admin1", "adminpwd1", redis.print);
client.set("admin2", "adminpwd2", redis.print);
client.set("admin3", "adminpwd3", redis.print);
client.set("admin4", "adminpwd4", redis.print);
client.set("admin5", "adminpwd5", redis.print);
client.set("admin6", "adminpwd6", redis.print);
client.set("admin7", "adminpwd7", redis.print);
client.set("admin8", "adminpwd8", redis.print);
client.set("admin9", "adminpwd9", redis.print);
client.set("admin10", "adminpwd10", redis.print);

client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');

client.hgetall('frameworks', function(err, object) {
    console.log(object);
});


exports.setInRedis = function(key, value){
	client.set(key, value, redis.print);
}

exports.getFromRedis = function(key, callback){
	client.get(key, function(error, value){
		//console.log('the key for something is = ' + value);
		callback(error, value);
	})
}