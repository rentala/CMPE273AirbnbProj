/**
 * Created by Rentala on 23-11-2016.
 */
//jquery dependecy
var logEvent = function (e, text) {
    $.ajax({
        method: "POST",
        url: "/log",
        data: { event: e, text: text, type: type }
    }).done(function(res) {
        console.log(res)
    });

}

$(function () {
    var type;
    $("body").on("click", "a" , function(e) {
        type = e.target.href.indexOf('api/property/id') != -1 ? "PROPERTYCLICK": "PAGECLICK";
        logEvent(e.target.innerText + " link", "Id: " + e.target.id +" link clicked "+ e.target.href, type)
    });
    $("body").on("click", "button" , function(e) {
        logEvent(e.target.innerText + " button", "Id: " + e.target.id +" form action "+ e.target.formAction + " form method" +e.target.formMethod )
    });
    $("body").on("click", "input[type='button']" , function(e) {
        logEvent(e.target.innerText + " button", "Id: " + e.target.id +" form action "+ e.target.formAction + " form method" +e.target.formMethod )
    });
    $("body").on("click", "input[type='submit']" , function(e) {
        logEvent(e.target.innerText + " button", "Id: " + e.target.id +" form action "+ e.target.formAction + " form method" +e.target.formMethod )
    });
})