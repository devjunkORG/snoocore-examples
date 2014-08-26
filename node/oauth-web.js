#!/usr/bin/env node
"use strict";

/*

EXAMPLE: oauth-web.js

An example of how to use web based OAuth

*/

var readline = require('readline')
, url = require('url')
, open = require('open')
, when = require('when')
, callbacks = require('when/callbacks')
, Snoocore = require('snoocore');

var reddit = new Snoocore({
	userAgent: 'snoocoreExample',
	oauth: {
		type: 'web',
		consumerKey: 'V_nb4nmEVcnAxA',
		consumerSecret: 'r6xY7zQi_tQaTIYLjZewYTYVi_0',
		redirectUri: 'http://localhost:3000'
	}
});

function waitForResponseUrl() {
	var defer = when.defer()
	, rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	var question = callbacks.lift(rl.question.bind(rl));
	return question('URL from address bar (after accept)\n> ')
	.tap(rl.close.bind(rl));
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
	var urlParams = url.parse(urlWithCode, true).query
	, returnedState = urlParams.state
	, authorizationCode = urlParams.code
	, errorMsg = urlParams.error;

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

	// Using the dot notation syntax below. Can be replaced with
	// reddit('/api/v1/me').get();
	return reddit.api.v1.me.get();

}).done(function(data) {

	console.log('\n\n', data);

});
