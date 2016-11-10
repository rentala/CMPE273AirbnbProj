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

var executeAsyncCode = function (err, data, func) {
    try{
        if(err){
            var id = getID();
            errorLogger.info('Error Id: ' + id + ' Error: ' + JSON.stringify(err));
            func(err, data, id);
        } else {
            func(err, data);
        }
    }
    catch(e){
        console.log(e);
    }
}
var getID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

exports.executeAsyncCode = executeAsyncCode;
exports.getErrID = getID;