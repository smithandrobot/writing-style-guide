var express = require('express');
var compression = require('compression');

var app = express();
var port = process.env.PORT || 8000;

app.use(cacheHeader())
app.use(compression());
app.use(__dirname + "/static");
console.log('Running on port: '+port)
app.listen(port);

// Add cache headers to express response
function cacheHeader() {
  return (function (req, res, next) {
    res.setHeader("Cache-Control", "public, max-age=345600"); // 4 days
    res.setHeader("Expires", new Date(Date.now() + 345600000).toUTCString());
    return next();
  })
}