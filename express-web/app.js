var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

var Snoocore = require('snoocore');

var uniqId = 0; // unique id for our user
var accounts = {}; // Snoocore instances. Each instance is a different account

function getInstance(accountId) {

    // Check if we already have an instance with this id. If
    // so, use this instance
    if (accounts[accountId]) {
        return accounts[accountId];
    }

    // Else, return a new instance
    return new Snoocore({
        userAgent: 'test-express-web / snoocore-examples',
        oauth: {
            type: 'explicit',
            duration: 'permanent',
            key: 'I5eqIja97ZhCnQ', // not an actual working key, use your own
            secret: 'JCb_4xYYMRqy3M2P-zKl_Dw-sgw', // not an actual working secret, use your own
            redirectUri: 'http://localhost:3000/reddit_redirect',
            scope: [ 'identity' ]
        }
    });
}

app.get('/', function (req, res) {
    var accountId = req.cookies ? req.cookies.account_id : void 0;

    // We have an account, redirect to the authenticated route
    if (accountId) {
        return res.redirect('/me');
    }

    var reddit = getInstance();
    return res.send('<a href="' + reddit.getAuthUrl() + '">Authenticate!</a>');
});

app.get('/me', function(req, res) {

    var accountId = req.cookies ? req.cookies.account_id : void 0;

    // If the user has not authenticated bump them back to the main route
    if (!accountId) {
        return res.redirect('/');
    }

    // Print out stats about the user, that's it.
    return accounts[accountId]('/api/v1/me').get().then(function(result) {
        return res.send(JSON.stringify(result, null, 4));
    });
});

// does not account for hitting "deny" / etc. Assumes that
// the user has pressed "allow"
app.get('/reddit_redirect', function(req, res) {

    var accountId = ++uniqId; // an account id for this instance
    var instance = getInstance(); // an account instance

    // In a real app, you would save the refresh token in
    // a database / etc for use later so the user does not have
    // to allow your app every time...
    return instance.auth(req.code).then(function(refreshToken) {
        // Store the account (Snoocore instance) into the accounts hash
        accounts[accountId] = instance;

        // Set the account_id cookie in the users browser so that
        // later calls we can refer to the stored instance in the
        // account hash


        console.log(accounts);
        res.cookie('account_id', String(accountId), { maxAge: 900000, httpOnly: true });

        // redirect to the authenticated route
        return res.redirect('/me');
    });

});

var server = app.listen(3000, function () {
  console.log('Example app listening at http://localhost:3000');
});
