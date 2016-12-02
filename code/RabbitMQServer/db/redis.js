/**
 * New node file
 */
var redis = require('redis');
var client = redis.createClient(8000, '127.0.0.1');

client.on('error', function(error){
	console.log(error);
})

client.set('something', 'soethingkey', redis.print);

client.get('something', function(error, value){
	if(error){
		throw error;
	}
	console.log('the key for something is = ' + value);
})