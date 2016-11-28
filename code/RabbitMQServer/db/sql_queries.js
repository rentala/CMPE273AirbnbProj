
var constants  =  require('node-constants');

constants.define(exports, {
    FETCH_BID_INFO:"select bidding_dtl.bidder_id,bidding_dtl.bid_price,bidding_dtl.bid_time,bidding_dtl.property_name from airbnb.bidding_dtl where property_id=?;",
    FETCH_BILLING_DTLS:"SELECT trip.user_id,trip.property_id,trip.property_name,billing.billing_id,trip.trip_price,trip.checkin_date,trip.checkout_date,trip.no_of_guests FROM airbnb.trip ,airbnb.billing WHERE trip.trip_id = ? and trip.trip_id = billing.trip_id and billing.bill_status = 'CREATED';",
    FETCH_ALL_BILLS : "SELECT trip.user_id,trip.property_id,trip.property_name,billing.billing_id,trip.trip_price,trip.checkin_date,trip.checkout_date,trip.no_of_guests,year(date(trip.trip_approved_time)) as year,month(date(trip.trip_approved_time)) as month,trip.trip_approved_time FROM airbnb.trip ,airbnb.billing WHERE billing.bill_status = 'CREATED';",
    FETCH_CITY_WISE_DATA: "SELECT property_id, property_name, SUM(trip.trip_price) as total_revenue,YEAR(date(trip.trip_approved_time)) as trip_year FROM trip WHERE trip.property_id IN (?) and trip.trip_status = 'ACCEPTED' GROUP BY property_id ,  property_name, trip_year ORDER BY trip_year limit ?;",
    FETCH_TOP_HOST:"SELECT host_id, host_name, sum(trip.trip_price) AS total_revenue FROM trip WHERE trip.trip_status = 'ACCEPTED' and month(date(trip.trip_approved_time)) = month(now()-interval 1 month) GROUP BY host_id, host_name ORDER BY total_revenue DESC LIMIT ?;",
    FETCH_TOP_PROP: "SELECT property_id,property_name, year(date(trip.trip_approved_time)) as trip_year,SUM(trip.trip_price) AS property_revenue FROM airbnb.trip WHERE trip.trip_status = 'ACCEPTED' GROUP BY property_id ,property_name, trip_year ORDER BY property_revenue DESC LIMIT ?;",
    FETCH_TRIP_DATES : "SELECT trip.property_id,trip.checkin_date,trip.checkout_date from airbnb.trip where property_id IN (?);",
    FETCH_USER_TRIP_DETAILS : "SELECT trip.*, (select b.billing_id from airbnb.billing b where b.trip_id = trip.trip_id) as billing_id" + " from airbnb.trip trip  where trip.user_id=?;",
    FETCH_HOST_TRIP_DETAILS : "SELECT trip.trip_id as trip_id,trip.user_id as user_id,trip.property_id as property_id,trip.host_id as host_id,trip.checkin_date as checkin_date,trip.checkout_date as checkout_date,trip.no_of_guests as no_of_guests,trip.trip_status as trip_status,  (select b.billing_id from airbnb.billing b where b.trip_id = trip.trip_id) as billing_id from airbnb.trip where trip.host_id=?;",
    DELETE_TRIP : "delete from airbnb.trip where trip.trip_id=?;",
    DELETE_BILL : "update airbnb.billing set bill_status='DELETED' where airbnb.billing.billing_id=?; ",
    CREATE_BILL : "insert into airbnb.billing(billing_id,trip_id,bill_status) values(null,?,?);" ,
    USER_COMPLETED_TRIPS : "select trip_id, property_id, property_name, host_id, host_name, checkin_date, checkout_date, no_of_guests from trip where user_id = ? and date(checkout_date) < curdate();",
    CREATE_TRIP : "INSERT into airbnb.trip (user_id, property_id, property_name, host_id, checkin_date, checkout_date, no_of_guests, trip_status, trip_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
    INSERT_PRODUCT_IN_BIDDING : "insert into airbnb.bidding set ? ",
    UPDATE_TRIP : "update airbnb.trip set trip_status = ?, trip_approved_time = CURRENT_TIMESTAMP where trip.trip_id=?",
    UPDATE_TRIP_DATES : "update airbnb.trip set trip_status = 'PENDING', checkin_date=?, checkout_date=?, no_of_guests= ?, trip_price=? where trip.trip_id=?",
    FETCH_PENDING_TRIPS: "select trip.user_id,trip.property_id,trip.property_name,trip.checkin_date,trip.checkout_date,trip.no_of_guests,trip.trip_price,trip.trip_status from airbnb.trip where trip.host_id=? and trip.trip_status='Pending';",
    INSERT_BID : "Insert into airbnb.bidding_dtl (bid_id, bidder_id, bid_price, property_id, property_name) values ( ?,?,?,?,?)",
    INBOX : "select * from airbnb.trip where host_id = ? and trip_status = 'PENDING';",
    FETCH_MAX_BID:"SELECT max_bid_price,host_min_amt FROM airbnb.bidding  WHERE property_id=?;",
    TRIP_REVIEWED : "update airbnb.trip set is_reviewed=1, rating=?, review_comment=? where trip_id=?",
    FETCH_ALL_BILLS_BY_DATE : "SELECT * FROM airbnb.trip, airbnb.billing where trip.trip_id = billing.trip_id and (date(trip.trip_approved_time)) = (date(?)) and bill_status != 'DELETED';",
    FETCH_ALL_BILLS_BY_MONTH : "SELECT * from airbnb.trip, airbnb.billing where trip.trip_id = billing.trip_id and (month(trip.trip_approved_time)) = (month(?)) and bill_status != 'DELETED';",
    FETCH_ALL_BILLS_BY_YEAR : "SELECT * from airbnb.trip, airbnb.billing where trip.trip_id = billing.trip_id and (year(trip.trip_approved_time)) = ? and bill_status != 'DELETED';"
});