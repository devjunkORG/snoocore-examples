#!/usr/bin/env node

/*

   EXAMPLE: cookieAuth.js

   Goes over basic authentication using Cookies. This example
   asks for the users username & password on the command line,
   but you can also pass the username & password into the
   initial configuration.

   You should consider using OAuth based authentication instead
   of username/password based authentication.

   View the documentation for more information.

 */

var readline = require('readline');
var when = require('when');
var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'Snoocore Examples GitHub: https://github.com/trevorsenior/snoocore-examples'
});

/*
   Asks the user on the terminal for their username & password and returns the
   object:

   {
   username: '<reddit username>',
   password: '<reddit password>'
   }

 */
function getUserInfo() {
  return when.promise(function(resolve, reject) {

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Reddit Username? > ', function(username) {
      rl.question('Reddit Password? > ', function(password) {
	rl.close();
	return resolve({ username: username, password: password });
      });
    });

  });
}


getUserInfo().then(function(userInfo) {
  return reddit.login({
    username: userInfo.username,
    password: userInfo.password
  });
}).then(function(loginData) {
  console.log(loginData);
  return reddit('/api/me.json').get();
}).then(function(meJsonData) {
  console.log(meJsonData);
}).catch(function(error) {
  console.error('oh no! something went wrong!');
  console.error(error.stack || error);
}).done();
