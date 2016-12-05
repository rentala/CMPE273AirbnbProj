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
        //type = e.target.href.indexOf('api/property/id') != -1 ? "PROPERTYCLICK": "PAGECLICK";
        logEvent( { url : e.target.href, type: "PAGECLICK" })
    });
})