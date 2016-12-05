/**
 * Created by Rentala on 23-11-2016.
 */
//jquery dependecy
var logEvent = function (data) {
    $.ajax({
        method: "POST",
        url: "/log",
        data: data
    }).done(function(res) {
        console.log(res)
    });

}

$(function () {
    $("body").on("click", "a" , function(e) {

        logEvent( { url : e.target.href, type: "PAGECLICK" })

    });
    logEvent({ url : window.location.href, type: "PAGECLICK" })
    function propertyClick (data) {
        data.type = "PROPERTYCLICK";
        logEvent(data);
    }
    function userActivityClick (data, event) {
        data.type = "USERACTIVITY";
        data.event = event;
        logEvent(data);
    }


})