/**
 * Created by Rentala on 09-11-2016.
 */
var winston = require('winston');
winston.remove(winston.transports.Console);
/*const errorLogger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.File)({
            filename: './logs/errors.log'
        })
    ]
});*/

function customFileFormatter (options) {
   // Return string will be passed to logger.
   return new Date().toLocaleString() + '\t' +(undefined !== options.message ? options.message : '');
    //(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}

function titleFileFormatter (options) {
   // Return string will be passed to logger.
   return (undefined !== options.message ? options.message : '');
    //(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}

//------------------Title Loggers--------------------
winston.loggers.add('prop_click_title_logger', {
   file: {
      filename: './logs/prop_click.tsv',
      formatter  : titleFileFormatter,
      json:false
     }
  });
winston.loggers.add('page_click_title_logger', {
   file: {
      filename: './logs/page_click.tsv',
      formatter  : titleFileFormatter,
      json:false
     }
  });
winston.loggers.add('user_info_title_logger', {
   file: {
      filename: './logs/user_info.tsv',
      formatter  : titleFileFormatter,
      json:false
     }
  });
//--------------------------------------------------
//-----------------Data Loggers---------------------
winston.loggers.add('prop_click_logger', {
   file: {
      filename: './logs/prop_click.tsv',
      formatter  : customFileFormatter,
      json:false
     }
  });
winston.loggers.add('page_click_logger', {
   file: {
      filename: './logs/page_click.tsv',
      formatter  : customFileFormatter,
      json:false
     }
  });
winston.loggers.add('user_info_logger', {
   file: {
      filename: './logs/user_info.tsv',
      formatter  : customFileFormatter,
      json:false
     }
  });

winston.loggers.add('error_logger', {
   file: {
      filename: './logs/error.log',
      formatter  : customFileFormatter,
      json:false
     }
  });

//--------------------------------------------------

var propClick_logger = winston.loggers.get('prop_click_logger');
var pageClick_logger = winston.loggers.get('page_click_logger');
var userInfo_logger = winston.loggers.get('user_info_logger');
var errorLogger = winston.loggers.get('error_logger');

//Loggers for title
var propClick_title_logger = winston.loggers.get('prop_click_title_logger');
var pageClick_title_logger = winston.loggers.get('page_click_title_logger');
var userInfo_title_logger = winston.loggers.get('user_info_title_logger');







var logError = function (err) {
    var id = getID();
    errorLogger.log('info','Error Id: ' + id + ' Error: ' + JSON.stringify(err));
};

var getID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

var logPropertyCicks = function(data){
	
	propClick_logger.log('info' , data.host_id + "\t" + data.user_id + "\t" + data.property_id + "\t" +data.property_name); 
};

var logPageClicks = function(data){
	
	pageClick_logger.log('info', data.page + "\t" + data.user_id + "\t" + data.element);
};

var logUserActivity = function(data){
	
	userInfo_logger.log('info' , data.user_id + "\t" + data.event);
};


//Methods for logging titles

var logPropClickTitle = function(data){
	
	propClick_title_logger.log('info',prepareTabbedString(data));
}

var logPageClickTitle = function(data){
	
	pageClick_title_logger.log('info',prepareTabbedString(data));
}

var logUserActivityTitle = function(data){
	
	userInfo_title_logger.log('info',prepareTabbedString(data));
}

var prepareTabbedString = function(obj){
	
	var str = [];
	
	for (var property in obj) {
	    
		if (obj.hasOwnProperty(property)) {
	       
	   	 str.push(obj[property] );
	    }
	}
	
	return str.join('\t');
}


//exports.executeAsyncCode = executeAsyncCode;
exports.getErrID = getID;
exports.logError = logError;
exports.logPropertyCicks = logPropertyCicks;
exports.logPageClicks = logPageClicks;
exports.logUserActivity = logUserActivity;
exports.logPropClickTitle = logPropClickTitle;
exports.logPageClickTitle = logPageClickTitle;
exports.logUserActivityTitle = logUserActivityTitle;