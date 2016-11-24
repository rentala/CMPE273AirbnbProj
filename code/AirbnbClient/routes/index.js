var express = require('express');
var ejs = require('ejs');
var router = express.Router();
var winston = require('winston');
const eventlogger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.File)({
      filename: '../logs/events.log'
    })
  ]
});
eventlogger.info('Hello world');
eventlogger.warn('Warning message');
eventlogger.debug('Debugging info');

/* GET home page. */
/*router.get('/', function(req, res, next) {
  ejs.render('./views/views/login.ejs');
});*/
router.get('/', function(req, res, next) {
  ejs.renderFile('./views/views/login.ejs', function (err, result) {
// render on success
    if (!err) {
      res.end(result);
    }
// render or error
    else {
     // tool.logError(err);
      res.end('An error occurred');
      console.log(err);
    }
  });
});

router.post('/log', function(req, res, next) {
  eventlogger.info('User Id: '+req.session.user._id+', '+ req.body.event+ ', '+ req.body.text);
  res.send(JSON.stringify({ result: true }));
});
module.exports = router;
