var mysql = require('./mysql');
var crypto = require('crypto');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.checkUser = function(req, res){
	var email_id = req.param("email");
	var password = req.param("password");
	
	password = encrypt(password);
	
	var json_responses;
	json_responses = {"statusCode" : 401};
	res.send(json_responses);
};



function encrypt(text){
	var algorithm = 'aes-256-ctr';
	var password = 'd6F3Efeq';
	
	var cipher = crypto.createCipher(algorithm,password)
	  var crypted = cipher.update(text,'utf8','hex')
	  crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text){
		var algorithm = 'aes-256-ctr';
		var password = 'd6F3Efeq';
		
	  var decipher = crypto.createDecipher(algorithm,password)
	  var dec = decipher.update(text,'hex','utf8')
	  dec += decipher.final('utf8');
	  return dec;
	}