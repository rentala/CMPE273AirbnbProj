/**
 * Created by Rentala on 09-11-2016.
 */
var mysql = require('mysql');//importing module mysql
var connMgr;
function connectionManager(capacity) {
    var connections = [];
    for(var i=0; i <capacity; i++){
        connections.push(getConnection());
    }
    function hasConn() {
        return connections.length > 0;
    }
    this.getConn = function (func) {
        if(hasConn()){
            var conn = connections.pop();
            func(conn);
            console.log("used a conn. Conns total: " + connections.length);
            connections.push(conn);
            console.log("put a conn. Conns total: " + connections.length);
        } else{
            setTimeout(getConn, 100);
            console.log("waiting for conn");
        }
    }
    this.releaseConn = function (conn) {
        connections.push(conn);
    }
    this.connections = capacity;
    connMgr = this;
}

function getConnection(){
    var connection = mysql.createConnection({
        host : 'localhost', //host where mysql server is running
        user : 'rentala', //user for the mysql application
        password : 'password@123', //password for the mysql application
        database : 'test', //database name
        port : 3306 //port, it is 3306 by default for mysql
    });
    return connection;
}
//fetching the data from the sql server
function fetchData(sqlQuery, param, successFn, errFn){
    console.log("\nSQL Query::"+sqlQuery);
    connMgr.getConn(function (connection) {
        connection.query(sqlQuery,param, function(err,res,as){
            if(err) throw err;
            if(successFn)successFn(res);
            if(res != undefined)
                console.log('Last insert ID:', res.insertId);
        }, errFn);
    });
}

exports.fetchData = fetchData;
exports.connectionManager  =connectionManager;
