/**
 * New node file
 */
var request = require('request')
    , express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('http tests', function(){

    it('Login', function(done) {
        request.post(
            'http://localhost:8000/api/auth/signInUser',
            { form: {email: 'krishnark1993@gmail.com',password:'krishna' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
    it('Registration page', function(done){
        request.post(
            'http://localhost:8000/api/auth/signUpUser',
            { form: {firstName: "Krishna", lastName: "rk", email: "krishnark19923@gmail.com", password: "krk",Dob:"2016-11-10",aptNum:"123",city:"san jose",email:"krishnark19923@gmail.com",firstName:"Krishna",lastName:"rk",password:"krk",phoneNumber:4089178875,ssn:"321-231-345",state:"CA",street:"1334 THE ALAMEDA APT 185",zipCode:"95126"} },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('Load Login Page', function(done){
        http.get('http://localhost:8000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('Load Admin Page', function(done){
        http.get('http://localhost:8000/api/admin/adminLogin', function(res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });
    it('Admin Login', function(done) {
        request.post(
            'http://localhost:8000/api/admin/adminCheckLogin',
            { body: {username: 'krishnark1993@gmail.com',password:'krishna' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
    /*it('Ebay Cart', function(done){
        http.get('http://localhost:3000/ebayCart', function(res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });*/


});