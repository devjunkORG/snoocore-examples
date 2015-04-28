
var $ = document.getElementById.bind(document);

function loadAwwPhoto(done) {
  // get a reference to the background page's window where we
  // have defined a snoocore instance on `window.reddit`
  return chrome.runtime.getBackgroundPage(function(bwindow) {
    return bwindow.reddit('/r/aww/hot').listing({
      limit: 1
    }).then(function(slice) {

      var submission = slice.children[0].data;
      var img = $('awwImg');
      var title = $('title');

      img.src = submission.thumbnail;
      title.innerText = submission.title;
      done();
    }).catch(done);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  loadAwwPhoto(console.error);
});
