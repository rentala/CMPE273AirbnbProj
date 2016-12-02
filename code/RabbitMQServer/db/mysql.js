/**
 * Created by Rentala on 09-11-2016. this is mysql setup
 */

var mysql = require('mysql');//importing module mysql
var sqlPool;
function getPool(connLimit) {
    var pool  = mysql.createPool({
        connectionLimit : connLimit,
        host            : 'localhost',
        user            : 'root',
        password        : 'password@123',
        database        : 'airbnb',
        multipleStatements : true
    });
    sqlPool = pool;
}

//add your mysql database call here and pass results to the callback that is on your services/<module>.js file.

//find below example of mysql call in property.js.

exports.execute_query = function(callback, sqlQuery, options) {
    console.log("\nSQL Query::" + sqlQuery);

    sqlPool.getConnection(function(err, connection) {
        // Use the connection
        connection.query( sqlQuery, options, function(err, rows,fields) {
            if (err) {
                console.log("ERROR: " + err.message);
            } else { // return err or result
                console.log("DB Results:" + rows);
                callback(err, rows);
            }
        })
        connection.release();
    });
};

exports.getPool = getPool;

