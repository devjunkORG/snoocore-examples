This is a *quick and dirty* demo of the Web based OAuth flow using an express server (not using passport, etc).

This is bare bones. It will ony authenticate a user, and show their profile. It has a simple instance manager and uses cookies to handle sessions. **Please** make this more robust in a real web app. As of now it is really easy to emulate other users and is strictly for demo purposes.

Open the application in two browsers and authenticate with different accounts to see how account management actually works / etc. Feel free to make pull requests to improve upon this.


## Required setup

- Make an app on reddit using explicit OAuth.
- Set the redirectUri to be: http://localhost:3000/reddit_redirect

![http://i.imgur.com/s3eTGSo.png]()

- Fill in the key / secret in app.js

## Starting the app

```javascript
node app.js
```

You should now have a server running on http://localhost:3000 that you can navigate to in your browser.
