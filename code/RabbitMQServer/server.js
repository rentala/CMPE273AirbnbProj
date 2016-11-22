//super simple rpc server example

var amqp = require('amqp'),
	util = require('util'),
	mongoURL = "mongodb://rentala:team5password@ds155097.mlab.com:55097/airbnb",
	// uncomment above and comment below line to make it work on mLab
	//mongoURL = "mongodb://localhost:27017/airbnb",
	mongo = require("./db/mongo"),
    mysql = require("./db/mysql"),
	cnn = amqp.createConnection({host:'127.0.0.1'});

var auth = require('./services/authentication');
var profile = require('./services/profile');
var property = require('./services/property');
var admin = require('./services/admin');
var trip = require('./services/trip');
var analytics = require('./services/analytics');
var host = require('./services/host');
var billing = require('./services/billing');

var mongoConn;
var connection;

mysql.getPool(10);

mongo.connect(mongoURL, function(db){
	mongoConn = db;
	connection = { mongoConn: mongoConn};
	console.log('Connected to mongo at: ' + mongoURL);
});


cnn.on('ready', function(){
	console.log("listening on all queues");

    //register - login queues
	cnn.queue('login_queue', function(q){
		subscriber(q, auth.login );
	});
	cnn.queue('register_queue', function(q){
		subscriber(q, auth.register );
	});

    //User queues
	cnn.queue('update_profile_queue', function(q){
		subscriber(q, profile.updateProfile );
	});
	cnn.queue('userinfo_queue', function(q){
		subscriber(q, profile.userInfo );
	});
    cnn.queue('delete_user_queue', function(q){
        subscriber(q, profile.deleteUser );
    });
    cnn.queue('review_user_queue', function(q){
        subscriber(q, host.reviewUser );
    });

    //Property queues
	cnn.queue('list_property_queue', function(q){
		subscriber(q, property.listProperty );
	});
	cnn.queue('search_property_queue', function(q){
		subscriber(q, property.searchProperty );
	});
    cnn.queue('get_property_by_id_queue', function(q){
        subscriber(q, property.getPropertyById );
    });
	cnn.queue('get_all_property_queue', function(q){
		subscriber(q, property.propList );
	});

    //Host queues
	cnn.queue('approve_host_queue', function(q){
		subscriber(q, admin.approveHost );
	});
	cnn.queue('pending_hosts_for_approval_queue', function(q){
		subscriber(q, admin.pendingHostsForApproval );
	});
	cnn.queue('delete_host_queue', function(q){
		subscriber(q, host.deleteHost );
	});
	cnn.queue('review_user_queue', function(q){
		subscriber(q, host.reviewUser );
	});
    //admin queues
	cnn.queue('adminLoginRequest_queue', function(q){
		subscriber(q, admin.checkLogin);
	});

    //Trip related queues
    cnn.queue('trip_details_queue', function(q){
        subscriber(q, trip.tripDetails );
    });
    cnn.queue('delete_trip_queue', function(q){
        subscriber(q, trip.deleteTrip );
    });
    cnn.queue('createTrip_queue', function(q){
        subscriber(q, trip.createTrip);
    });
    cnn.queue('update_trip_queue', function(q){
        subscriber(q, trip.updateTrip );
    });
    cnn.queue('create_trip_review_queue', function(q){
        subscriber(q, trip.createTripReview );
    });
    cnn.queue('pending_trips_queue',function (q) {
        subscriber(q,trip.pendingTripsForApproval);
    });
    //Analytics Queues
	cnn.queue('top_property_queue', function(q){
		subscriber(q, analytics.topProp );
	});
    cnn.queue('city_wise_data_queue', function(q){
        subscriber(q, analytics.cityWiseData);
    });
    cnn.queue('top_host_queue', function(q){
        subscriber(q, analytics.topHost );
    });
	//Billing queues
    cnn.queue('get_bill_queue',function (q) {
        subscriber(q,billing.view);
    });
    cnn.queue('delete_bill_queue',function (q) {
        subscriber(q,billing.deleteBill);
    });
    cnn.queue('edit_trip_queue',function (q) {
        subscriber(q,trip.editTrip);
    });

});

var subscriber = function(q, module) {
	q.subscribe(function (message, headers, deliveryInfo, m) {
		util.log(util.format(deliveryInfo.routingKey, message));
		util.log("Message: " + JSON.stringify(message));
		util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
		module.handle_request(connection, message, function (err, res) {
			cnn.publish(m.replyTo, res, {
				contentType: 'application/json',
				contentEncoding: 'utf-8',
				correlationId: m.correlationId
			});
		});
	});
}

