/*
   EXAMPLE: oauth-web-permanent-2.js

   Part two in a series, please run the first script
   'oauth-web-permanent-1.js` to receive the "refresh token" that
   this script will ask for.

   This script demonstrates that once we have a refresh code,
   we can use it to re-authenticate a users account without
   having re-request access through the web interface.
 */

var readline = require('readline');
var url = require('url');
var open = require('open');
var when = require('when');
var callbacks = require('when/callbacks');
var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'Snoocore-examples@oauth-explicit-permanent-2',
  oauth: {
    type: 'explicit',
    duration: 'permanent',
    key: '',
    secret: '',
    redirectUri: '',
    scope: [ 'identity' ]
  }
});

function waitForRefreshToken() {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var question = callbacks.lift(rl.question.bind(rl));
  return question('Refresh Token (from the first script)> ').tap(rl.close.bind(rl));
}

waitForRefreshToken().then(function(refreshToken) {

  // This is similar to calling `reddit.auth` in that it will
  // authenticate a user using a refresh token vs. an
  // authorization code.
  return reddit.refresh(refreshToken);

}).then(function() {

  // We are now authenticated
  console.log('\n\nWe are now authenticated!\n');

  // We can now make OAuth calls using the authenticated user.
  return reddit('/api/v1/me').get();

}).done(function(data) {

  console.log('\n\n', data);

  // you should always deauthenticate when done with a users account
  // e.g. "logout"
  console.log('\n Deauthenticating... ');
  return reddit.deauth(); // revoke the current access_token

});
