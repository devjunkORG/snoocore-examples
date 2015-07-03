var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');
var Snoocore = require('snoocore');
var Promise = require('bluebird');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

var reddit = new Snoocore({
  userAgent: 'snoocore-electron-test',
  oauth: {
    type: 'explicit',
    duration: 'permanent',
    key: '',
    secret: '',
    redirectUri: '',
    scope: [ 'identity' ],
    mobile: true
  }
});

/*
   Attempt to authenticate with reddit.

   @return {Promise}
 */
function authenticate() {
  return new Promise(function(resolve, reject) {

    var authWindow = new BrowserWindow({
      width: 400,
      height: 500,
      show: false,
      'node-integration': false
    });

    var authUrl = reddit.getAuthUrl();
    authWindow.loadUrl(authUrl);
    authWindow.show();

    // Handle the redirect from reddit
    authWindow.webContents.on('did-get-redirect-request', function(e, oldUrl, newUrl) {
      var raw_code = /code=([^&]*)/.exec(newUrl) || null;
      var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(newUrl);

      // Close the browser if code found or error
      if (code || error) {
        authWindow.close();
      }

      // If there is a code in the callback, proceed to auth with reddit
      if (code) {
        reddit.auth(code).then(resolve).catch(reject);
      } else if (error) {
        reject(new Error('Failed to authenticate, reason: ' + error.message));
      }
    });

    // Reset the authWindow on close
    authWindow.on('close', function() {
      authWindow = null;
    }, false);
  });
}


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 500, height: 500});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the devtools.
  // mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.focus();

  setTimeout(function() {
    authenticate().then(function(refreshToken) {
      console.log('REFRESH_TOKEN', refreshToken);
      return reddit('/api/v1/me').get();
    }).then(function(result) {
      console.log(result);
    });
  }, 3000);

});
