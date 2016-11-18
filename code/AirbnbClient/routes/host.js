/**
 * Created by Rentala on 11-11-2016.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('./host/becomeHost.ejs');
});

module.exports = router;
