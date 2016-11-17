//ADD your prepared query here. Replace inputs with question marks.
//Go to MYSQL.js and add your fetch query.More details on that file...

var constants  =  require('node-constants');

constants.define(exports, {

    FETCH_TRIP_DATES : "SELECT trip.checkin_date,trip.checkout_date from airbnb.trip where property_id IN (?)"
});