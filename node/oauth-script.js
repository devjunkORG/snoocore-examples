#!/usr/bin/env node

/*

   EXAMPLE: oauth-script.js

   Goes over how to authenticate with OAuth using script based
   authentication.

 */

var config = require('./exampleConfig');

var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'Snoocore Examples GitHub: https://github.com/trevorsenior/snoocore-examples',
  login: {
    username: config.login.username,
    password: config.login.password
  },
  oauth: {
    type: 'script',
    consumerKey: config.oauthScript.consumerKey,
    consumerSecret: config.oauthScript.consumerSecret,
    scope: [ 'identity' ]
  }
});

reddit.auth().then(function() {
  return reddit('/api/v1/me').get();
}).then(function(results) {
  console.log(results);
}).done();
