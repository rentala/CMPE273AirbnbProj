var tool = require("../utili/common");
var login = {
	handle_request : function (connection, msg, callback){

		var res = {};
		console.log("In handle request:");
		console.log(msg);
		var coll = connection.mongoConn.collection('users');
		console.log("Coll is users");
		coll.findOne({email: msg.email},
			//handles async and sync errors and logs them
			function(err, user, id){
				console.log("User is ")
				console.log(user);
				if (user) {
					res.code = "200";
					res.value = user;
				} else {
					res.code = "400";
					res.value = id;
				}
				callback(null, res);
			});


	}
}

exports.login = login;
