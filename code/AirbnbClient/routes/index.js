var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var winston = require('winston');
var common = require('../utili/common.js');
const eventlogger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.File)({
      filename: '../logs/events.log'
    })
  ]
});

/* GET home page. */
/*router.get('/', function(req, res, next) {
  ejs.render('./views/views/login.ejs');
});*/
router.get('/', function(req, res, next) {
  res.render('./views/login.ejs', { loggedOut : req.query.error == "1"});
});

router.post('/log', function(req, res, next) {
  switch(req.body.type){
    case "PAGECLICK":
      common.logPageClicks({
        page_url: req.body.url,
        clicks : 1
      })
      break;
    case "PROPERTYCLICK":
      common.logPropertyCicks({
        host_id : 1,
        property_id: 1,
        property_name: "asd",
        clicks: 1
      });
      break;
    case "USERACTIVITY":
      common.logUserActivity({
        user_id : 1,
        user_name: 1,
        property_id: 1,
        property_name : "sd",
        city: 1,
        event: "Some event"
      })
      break;


  }

  //eventlogger.info('User Id: '+req.session.user._id+', '+ req.body.event+ ', '+ req.body.text);
  res.send(JSON.stringify({ result: true }));
});
module.exports = router;
