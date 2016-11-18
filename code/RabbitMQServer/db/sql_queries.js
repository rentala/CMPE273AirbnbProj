//ADD your prepared query here. Replace inputs with question marks.
//Go to MYSQL.js and add your fetch query.More details on that file...

var constants  =  require('node-constants');

constants.define(exports, {

    FETCH_TRIP_DATES : "SELECT trip.property_id,trip.checkin_date,trip.checkout_date from airbnb.trip where property_id IN (?)",
    FETCH_USER_TRIP_DETAILS : "SELECT trip.trip_id as trip_id,trip.user_id as user_id,trip.property_id as property_id,trip.host_id as host_id,trip.billing_id as billing_id,trip.checkin_date as checkin_date,trip.checkout_date as checkout_date,trip.no_of_guests as no_of_guests,trip.trip_status as trip_status from airbnb.trip where trip.user_id=?;",
    FETCH_HOST_TRIP_DETAILS : "SELECT trip.trip_id as trip_id,trip.user_id as user_id,trip.property_id as property_id,trip.host_id as host_id,trip.billing_id as billing_id,trip.checkin_date as checkin_date,trip.checkout_date as checkout_date,trip.no_of_guests as no_of_guests,trip.trip_status as trip_status from airbnb.trip where trip.host_id=?;",
    DELETE_TRIP : "delete from airbnb.trip where trip.trip_id=?;"
    CREATE_TRIP : "INSERT into airbnb.trip (user_id, property_id, host_id, checkin_date, checkout_date, no_of_guests, trip_status, trip_approved_time) VALUES (?, '34', '43', now(), now() + 3, 4, 'P', now());"
});