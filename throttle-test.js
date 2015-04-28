/*
   EXAMPLE: throttle-test.js

   A quick demonstration that illustrates how the internal
   throttle of Snoocore works.
 */

var Snoocore = require('snoocore');

// Reddit app type "installed"
var reddit = new Snoocore({
  userAgent: 'Snoocore-examples@listings-iterate',
  throttle: 3000, // make the throttle much longer than necessary
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
