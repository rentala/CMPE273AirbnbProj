var tool = require("../utili/common");
ObjectID = require('mongodb').ObjectID;

var updateProfile = {
		handle_request : function (connection, msg, callback){
			console.log("inside");
		var res = {};
		console.log("inside2"+ msg.user_id[0]);
		var obj_id = new ObjectID(msg.user_id[0]);
		console.log("inside3"+obj_id);
		var coll = connection.mongoConn.collection('users');
		try{
			coll.update({"_id" :obj_id},{$set:{
				"email": msg.email, 
    			"first_name": msg.firstName, 
    			"last_name": msg.lastName,
    			"dob":msg.Dob,
    			"street":msg.street,
				"aptNum":msg.aptNum,
				"city":msg.city,
				"state":msg.state,
				"zipcode":msg.zipCode,
				"phone":msg.phoneNumber,
				"ssn":msg.ssn,
				"last_update_date":new Date()
				}
			}, function(err, user){
				if(err){
					res.code= "400";
					callback(null, res);
				}
				else
				{
					res.code= "200";
					callback(null, res);
				}
			});
		}
		catch(err){
			res.code = "500";
			callback(null, res);
		}
	}
};

var userInfo = {
		handle_request : function (connection, msg, callback){
		var res = {};
		var obj_id = new ObjectID(msg.user_id);
		var coll = connection.mongoConn.collection('users');
		try{
			coll.findOne({"_id":obj_id}, function(err, user){
				if(err){
					res.code ="401";
					callback(null, res);
		    			}
				else if(user != null)
	    			{
					res.code ="200";
					res.user = user;
					callback(null, res);
		    			}
				else{
					res.code ="500";
					callback(null, res);
				}
    		});
		}
		catch(err){
			res.statusCode = "400";
			callback(null, res);
		}
	}
};

var deleteUser = {
		handle_request : function (connection, msg, callback){
		var res = {};
		var obj_id = new ObjectID(msg.user_id);
		var coll = connection.mongoConn.collection('users');
		try{
			coll.update({"_id" :obj_id},{$set:{
				"is_active": "N"}
			}, function(err, user){
				if(err){
					res.code= "400";
					callback(null, res);
				}
				else
				{
					res.code= "200";
					callback(null, res);
				}
			});
		}
		catch(err){
			res.statusCode = "400";
			callback(null, res);
		}
	}
}

exports.updateProfile = updateProfile;
exports.userInfo =userInfo ;
exports.deleteUser = deleteUser;