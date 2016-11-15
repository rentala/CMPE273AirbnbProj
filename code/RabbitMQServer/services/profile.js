var tool = require("../utili/common");
ObjectID = require('mongodb').ObjectID;

var updateProfile = {
		handle_request : function (connection, msg, callback){
		console.log("inside update profile");
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
				"address":msg.aptNum,
				"city":msg.city,
				"state":msg.state,
				"zipcode":msg.zipCode,
				"phone":msg.phoneNumber,
				"ssn":msg.ssn,
				"is_host":"N",
    			"last_update_date":new Date()
				}
			}, function(err, user){
				if(err){
					console.log("inside update profile err" + err);
					res.statusCode= "400";
					callback(null, res);
				}
				else
				{
					console.log("inside update profile success");
					res.statusCode= "200";
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