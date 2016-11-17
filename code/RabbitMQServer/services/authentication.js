var tool = require("../utili/common");
var bcrypt = require('bcrypt-nodejs');

var login = {
	handle_request : function (connection, msg, callback){
		var res = {};
		console.log(msg);
		var coll = connection.mongoConn.collection('users');
		coll.findOne({email: msg.email, "is_active": "Y"},
			function(err, user, id){
				if(err){
					tool.logError(err);
				}
				if (user) {
					res.code = "200";
					res.value = user;
				} 
				else if (user!= null && !bcrypt.compareSync(msg.password, user.password)){
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
				//initially check if email already registered
	    		coll.findOne({
	    			"email": msg.email
	    		}, function(err, user){
	    			if(user != null){
	    				res.code ="401";
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
	        				"is_host":"N",
			    			"date":new Date(),
			    			"is_active": "Y"
			    		}, function(err, user){
			    			if(err){
			    				res.code ="400";
			        			callback(null, res);
			    			}
			    			else
			    			{
			    				res.user_id = user.insertedIds,
			    				res.first_nm = user.first_name ;
			    				res.code ="200";
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

exports.login = login;
exports.register = register;
