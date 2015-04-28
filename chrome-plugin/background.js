// Reddit app type "installed"
// Snoocore is defined in manifest.json

// Expose reddit on the background page's window
window.reddit = new Snoocore({
  userAgent: 'Snoocore-examples@listings-basic',
  throttle: 0,
  oauth: {
    type: 'implicit',
    key: 'VqhNmheQrdsnlg',
    redirectUri: 'http://localhost:3000',
    scope: []
  }
});
