#!/usr/bin/env node
"use strict";

/*

EXAMPLE: oauth-script.js

Goes over how to authenticate with OAuth using script based
authentication.

*/

var readline = require('readline')
, Snoocore = require('snoocore');

var reddit = new Snoocore({ 
	userAgent: 'snoocoreExample',
	login: { 
		username: 'snoocore', 
		password: '' 
	},
	oauth: { 
		type: 'script', 
		consumerKey: 'wU42GYDQ6PXvLA',
		consumerSecret: 'm-MYktvFelfz_E85GLzBM09DMbU'
	}
});

return reddit.auth().then(reddit('/api/v1/me').get).done(console.log);

/*

return reddit.auth().then(function() {
  return reddit('/api/v1/me').get();
}).done(function(data) {
  console.log(data);
});

*/
