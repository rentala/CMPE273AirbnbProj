	var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var flash = require('connect-flash');
var http = require('http');
var index = require('./routes/index');
var host = require('./routes/host');
//var host = require('./routes/host');
var authentication = require('./routes/authentication');
var profile = require('./routes/profile');
var property = require('./routes/property');
var admin = require('./routes/admin');
var trip = require('./routes/trip');
var analytics = require('./routes/analytics');
var billing = require("./routes/billing");
var inbox = require('./routes/inbox');
var appLogger = require('./utili/common');

var app = express();

app.use(session({
  secret: "CMPE273_passport",
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 6 * 1000,
  saveUninitialized: false,
  resave: false,
  store: new mongoStore({ url: 'mongodb://rentala:team5password@ds155097.mlab.com:55097/airbnb' })
}));
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(flash()); // use connect-flash for flash messages stored in session

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//USE '/routeName' for all page renders/redirection
app.use('/', index);

//USE '/api/routName' for all JSON response apis
    app.use('/api/admin',admin);
//comment below line when testing
app.use('*', homePageExcl);

app.use('/api/auth', authentication);
//comment below line when testing
app.use('*', assertAuthentication);
app.use('/host', host);
app.use('/api/profile', profile);
app.use('/api/property',property);

app.use('/api/trip',trip);
app.use('/api/analytics',analytics);
app.use('/api/billing',billing);
app.use('/api/inbox', inbox);

function assertAuthentication(req, res, next) {
   if(req.session.user != null && req.session.user != undefined){
        next();
   } else{
     res.redirect('/?error=1')
   }
}

function homePageExcl(req, res, next) {
    if(req.baseUrl == "/api/auth/home"){
        assertAuthentication(req, res, next)
    } else{
        next();
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.set('port', 8000);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  
  //Log title in the log files
  /*appLogger.logPropClickTitle({title1:"Timestamp",title2:"Host_id",title3:"User_id",title4:"Property_id",title5:"Property_name"})
  appLogger.logPageClickTitle({title1:"Timestamp",title2:"Page",title3:"User_id",title4:"Element"})
  appLogger.logUserActivityTitle({title1:"Timestamp",title2:"User_id",title3:"Event"})*/
});
module.exports = app;

