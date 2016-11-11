/**
 * Created by Rentala on 09-11-2016.
 */
var winston = require('winston');
const errorLogger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.File)({
            filename: './logs/errors.log'
        })
    ]
});

var logError = function (err) {
    var id = getID();
    errorLogger.info('Error Id: ' + id + ' Error: ' + JSON.stringify(err));
}

var getID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

exports.executeAsyncCode = executeAsyncCode;
exports.getErrID = getID;
exports.logError = logError;