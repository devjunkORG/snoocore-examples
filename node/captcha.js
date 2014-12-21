#!/usr/bin/env node

/*

A demonstration on how to handle a CAPTCHA request. To
use this you will have to fill in your password before
running the demo.

*/

var config = require('./exampleConfig');

// Change these if you wish. Running this script will make a new
// post in `bottest`.
var SUBREDDIT = 'bottest';
var TITLE = 'test post please ignore ' + String(Math.random() * 1000);
var LINK = 'https://duckduckgo.com/?q=' + String(Math.random() * 1000);

// node modules
var readline = require('readline');

// npm modules
var open = require('open');
var when = require('when');
var Snoocore = require('snoocore'); 

// init snoocore (using cookie login for simplicity)
var reddit = new Snoocore({
  userAgent: 'Snoocore Examples GitHub: https://github.com/trevorsenior/snoocore-examples',
  login: { 
    username: config.login.username,
    password: config.login.password
  },
  oauth: {
    type: 'script',
    consumerKey: config.oauthScript.consumerKey,
    consumerSecret: config.oauthScript.consumerSecret,
    scope: [ 'submit' ]
  }
});

// Ask the user a question on the command line - resolves
// with their answer
function askQuestion(questionText) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout });

  return when.promise(function(resolve, reject) {
    rl.question(questionText, resolve);
  }).tap(rl.close.bind(rl));
}


// Solves a captcha.
//
// It can take an existing iden, or it can generate a new
// one if none provided.
//
// Returns and object with the iden and captcha. They will be
// both undefined if the user does not need to solve the captcha
function solveCaptcha(iden) {

  // If we passed in an identity, save some time and skip over the needs
  // captcha check - we already know that we need one.
  var needsCaptcha = iden ?
		     when.resolve(true) :
		     reddit('/api/needs_captcha.json').get();

  return needsCaptcha.then(function(result) {
    // nothing needs to be solved
    if (result !== true) { return {}; }

    // Use existing identity if passed in & mirror how reddit responds
    // Else, request a new iden from reddit
    return iden ?
		   when.resolve({ json: { data: { iden: iden }}}) :
		   reddit('/api/new_captcha').post({ api_type: 'json' });

  }).then(function(result) {
    var iden = result.json.data.iden;
    var imageUrl = 'https://www.reddit.com/captcha/' + iden;

    // open the image in the users browser
    console.log(imageUrl);
    open(imageUrl);

    // ask what the captcha says on it
    return askQuestion('What did the captcha say? > ').then(function(answer) {
      // return the needed information to get through captcha
      return { iden: iden, captcha: answer };
    });
  });
}

function submitLink(sr_fullname, title, url) {
  return solveCaptcha().then(function(solveResult) {
    return reddit('/api/submit').post({
      api_type: 'json',
      iden: solveResult.iden,
      captcha: solveResult.captcha,
      sr: sr_fullname,
      title: title,
      url: url,
      kind: 'link',
      resubmit: true
    });
  });
}


reddit.auth().then(function() {
  return submitLink(SUBREDDIT, TITLE, LINK);
}).done(function(result) {
  console.log(result);
  // spit out any errors that we may have
  result.json.errors.forEach(console.log);
});
