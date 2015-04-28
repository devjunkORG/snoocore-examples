/*
   EXAMPLE: throttle-test.js

   A quick example that shows what happens when throttle
   is set to `0`.
 */

var Snoocore = require('snoocore');

// Reddit app type "installed"
var reddit = new Snoocore({
  userAgent: 'Snoocore-examples@listings-iterate',
  throttle: 0,
  oauth: {
    type: 'implicit',
    key: 'VqhNmheQrdsnlg',
    redirectUri: 'http://localhost:3000',
    scope: [ 'read' ]
  }
});

function printNetSecAbout(i) {
  reddit('/hot').get({ limit: 1 }).done(function(res) {
    console.log(i + ': ' + res.kind);
  });
}

// Note that order is NOT garaunteed. The promises will
// resolve once reddit comes back with a response.
for (var i = 0; i < 3; ++i) {
  console.log('queued', i);
  printNetSecAbout(i);
}
