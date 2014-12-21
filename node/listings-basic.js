#!/usr/bin/env node

/*

   EXAMPLE: listing-basic.js

   Gives an example of how to use the listings  helper
   built into snoocore. Every listing gives back a "slice"
   that you can use to get information about the listing,
   get the next slice of the listing, previous slice, etc.

   View the full documentation for more information.

 */

var when = require('when');
var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'Snoocore Examples GitHub: https://github.com/trevorsenior/snoocore-examples'
});

// Get information about a slice of a listing
function printSlice(slice) {
  slice.stickied.forEach(function(item, i) {
    console.log('**STICKY**', item.data.title.substring(0, 20) + '...');
  });

  slice.children.forEach(function(child, i) {
    console.log(slice.count + i + 1, child.data.title.substring(0, 20) + '...');
  });
}

reddit('/r/$subreddit/hot').listing({
  $subreddit: 'netsec',
  limit: 5
}).then(function(slice) {
  printSlice(slice);
  return slice.next();
}).then(function(slice) {
  printSlice(slice);
  return slice.next();
}).done(printSlice);
