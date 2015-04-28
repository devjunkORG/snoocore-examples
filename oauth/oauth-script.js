/*

   EXAMPLE: oauth-script.js

   Goes over how to authenticate with OAuth using script based
   authentication.

 */

var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'Snoocore-examples@oauth-script',
  oauth: {
    type: 'script',
    key: '',
    secret: '',
    username: '',
    password: '',
    scope: [ 'identity' ]
  }
});

return reddit.auth().then(function() {
  return reddit('/api/v1/me').get();
}).then(function(results) {
  console.log(results);
}).catch(console.error);
