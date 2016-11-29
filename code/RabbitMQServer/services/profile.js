var tool = require("../utili/common");
ObjectID = require('mongodb').ObjectID;

var updateProfile = {
		handle_request : function (connection, msg, callback){
		var res = {};
		var obj_id = new ObjectID(msg.user_id);
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


var uploadPic = {
		handle_request : function (connection, msg, callback){
		var res = {};
		var obj_id = new ObjectID(msg.user_id);
		var coll = connection.mongoConn.collection('users');
		try{
			coll.update({"_id" :obj_id},{$set:{
				"picture_path": msg.picture_path
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
var uploadvideo = {
	handle_request : function (connection, msg, callback){
		var res = {};
		var obj_id = new ObjectID(msg.user_id);
		var coll = connection.mongoConn.collection('users');
		try{
			coll.update({"_id" :obj_id},{$set:{
				"video_path": msg.video_path
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
var reloadUser = {
		handle_request : function (connection, msg, callback){
			var res = {};
			console.log(msg);
			var obj_id = new ObjectID(msg.user_id);
			
			var coll = connection.mongoConn.collection('users');
			coll.findOne({"_id" :obj_id},
			function(err, user, id){
				if(err){
					tool.logError(err);
				}
				else {
					res.code = "200";
					res.value = user;
				}
				callback(null, res);
			});
		}
	};

exports.uploadvideo = uploadvideo;
exports.updateProfile = updateProfile;
exports.userInfo =userInfo ;
exports.deleteUser = deleteUser;
exports.uploadPic =uploadPic;
exports.reloadUser = reloadUser;