# Electron

An example Electron app that uses Explicit OAuth to authenticate with reddit.

It will wait 3 seconts, then prompt to authenticate. After allowing the application, it will log out some information in the console about the authenticated user.

## Setup

Fill in your key, secret, and redirect uri in the Snoocore config in the code.

## Run

I had to use the full path to my electron binary before it would capture my inputs properly. You may be able to get away with `electron main.js`

```
/opt/homebrew-cask/Caskroom/electron/0.28.3/Electron.app/Contents/MacOS/Electron main.js
```
