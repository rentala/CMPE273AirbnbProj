var express = require('express');
var ejs = require('ejs');
var router = express.Router();

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
module.exports = router;
