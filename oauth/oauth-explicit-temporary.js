/*

   EXAMPLE: oauth-explicit-temporary.js

   An example of how to use web based OAuth. Note that this is for
   a web OAuth with a duration that is temporary. If you need to
   reauthenticate with a user without their permission later down
   the road, or need access for more than an hour, take a look at
   the explicit-permanent examples.

 */

var readline = require('readline');
var url = require('url');
var open = require('open');
var when = require('when');
var callbacks = require('when/callbacks');
var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'Snoocore-examples@oauth-explicit-temporary',
  oauth: {
    type: 'explicit',
    duration: 'temporary',
    key: 'FqF3WdkIVVGtlA',
    secret: 'BKYTo8RgQqULqn8XdSFjEloWCy4',
    redirectUri: 'https://localhost:3000',
    scope: [ 'identity' ]
  }
});

function waitForResponseUrl() {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var question = callbacks.lift(rl.question.bind(rl));
  return question('URL from address bar (after accept)\n> ').tap(rl.close.bind(rl));
}


// used to prevent CSRF... use something better than this!
// it is optional, but recommended!
var state = String(Math.ceil(Math.random() * 1000, 10));

// If you didn't use a state, there isn't a need to pass it in
var authUrl = reddit.getAuthUrl(state);

console.log('Visit this URL in your browser:\n\n', authUrl);
open(authUrl);

waitForResponseUrl().then(function(urlWithCode) {
  // pull out the error, code, and state
  var urlParams = url.parse(urlWithCode, true).query;
  var returnedState = urlParams.state;
  var authorizationCode = urlParams.code;
  var errorMsg = urlParams.error;

  // check for any errors with authenticating, exit if any
  if (errorMsg) { return when.reject(new Error(errorMsg)); }

  // check that our state is the same as the one we provided
  // above else exit!
  if (state !== returnedState) {
    console.error('Generated State:', state);
    console.error('Returned State:',returnedState);
    return when.reject(new Error('state returned did not match!'));
  }

  // If there were no errors, and the state is valid, we can now
  // authenticate!
  return reddit.auth(authorizationCode);

}).then(function() {

  // We are now authenticated
  console.log('\n\nWe are now authenticated!\n');

  // We can now make OAuth calls using the authenticated user.
  return reddit('/api/v1/me').get();

}).done(function(data) {

  console.log('\n\n', data);

});
