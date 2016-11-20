
var constants  =  require('node-constants');

constants.define(exports, {
    FETCH_CITY_WISE_DATA: "select trip.property_id,trip.property_name,sum(trip.trip_price),extract(year from trip.trip_approved_time) from airbnb.trip where trip.property_id IN (?) and trip.trip_status='ACCEPTED'group by trip.property_id, extract(year from trip.trip_approved_time) order by extract(year from trip.trip_approved_time);",
    FETCH_TOP_HOST:"select trip.user_id, sum(trip.trip_price) as revenue,extract(month from trip.trip_approved_time) as trip_month from airbnb.trip where trip.trip_status='ACCEPTED' and month(trip_approved_time)= (month(now())-1) group by trip.user_id order by revenue desc;",
    FETCH_TOP_PROP: "select trip.property_name , sum(trip.trip_price) as property_revenue from airbnb.trip where trip.trip_status ='ACCEPTED' group by trip.property_id order by property_revenue",
    FETCH_TRIP_DATES : "SELECT trip.property_id,trip.checkin_date,trip.checkout_date from airbnb.trip where property_id IN (?) and user_id!=?;",
    FETCH_USER_TRIP_DETAILS : "SELECT trip.trip_id as trip_id,trip.user_id as user_id,trip.property_id as property_id,trip.host_id as host_id,trip.billing_id as billing_id,trip.checkin_date as checkin_date,trip.checkout_date as checkout_date,trip.no_of_guests as no_of_guests,trip.trip_status as trip_status from airbnb.trip where trip.user_id=?;",
    FETCH_HOST_TRIP_DETAILS : "SELECT trip.trip_id as trip_id,trip.user_id as user_id,trip.property_id as property_id,trip.host_id as host_id,trip.billing_id as billing_id,trip.checkin_date as checkin_date,trip.checkout_date as checkout_date,trip.no_of_guests as no_of_guests,trip.trip_status as trip_status from airbnb.trip where trip.host_id=?;",
    DELETE_TRIP : "delete from airbnb.trip where trip.trip_id=?;",
    CREATE_TRIP : "INSERT into airbnb.trip (user_id, property_id, host_id, checkin_date, checkout_date, no_of_guests, trip_status) VALUES (?, ?, ?, ?, ?, ?, ?);",
    INSERT_PRODUCT_IN_BIDDING : "insert into airbnb.bidding set ? ",
    UPDATE_TRIP : "update airbnb.trip set trip_status = ?, trip_approved_time = CURRENT_TIMESTAMP where trip.trip_id=?"
});