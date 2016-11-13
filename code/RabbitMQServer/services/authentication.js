var tool = require("../utili/common");
var bcrypt = require('bcrypt-nodejs');

var login = {
	handle_request : function (connection, msg, callback){
		var res = {};
		console.log(msg);
		var coll = connection.mongoConn.collection('users');
		coll.findOne({email: msg.email},
			function(err, user, id){
				if(err){
					tool.logError(err);
				}
				if (user) {
					res.code = "200";
					res.value = user;
				} 
				else if (!bcrypt.compareSync(msg.password, user.password)){
					res.code = "200";
					res.value = user;
				}
				else {
					res.code = "400";
					res.value = id;
				}
				callback(null, res);
			});
	}
}

var register = {
		handle_request : function (connection, msg, callback){
			var res = {};
			var coll = connection.mongoConn.collection('users');
			try{
	    		coll.findOne({
	    			"email": msg.email
	    		}, function(err, user){
	    			if(user != null){
	    				res.statusCode ="400";
	        			callback(null, res);
	    			}	
	    			else{	
			    		coll.insert({
			    			"email": msg.email, 
			    			"password": bcrypt.hashSync(msg.password, null, null) , 
			    			"first_name": msg.firstName, 
			    			"last_name": msg.lastName,
			    			"dob":msg.Dob,
			    			"street":msg.street,
	        				"address":msg.aptNum,
	        				"city":msg.city,
	        				"state":msg.state,
	        				"zipcode":msg.zipCode,
	        				"phone":msg.phoneNumber,
	        				"ssn":msg.ssn,
			    			"date":new Date()
			    		}, function(err, user){
			    			if(err){
			    				res.statusCode ="400";
			        			callback(null, res);
			    			}
			    			else
			    			{
			    				res.user_id = user.insertedIds,
			    				res.first_nm = user.first_name ;
			    				res.statusCode ="200";
			        			callback(null, res);
			    			}
			    		});
	    			}
	    		});
			}
			catch(err){
				res.statusCode = "500";
				callback(null, res);
			}
		}
	}


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


exports.login = login;
exports.register = register;
