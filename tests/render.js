var assert = require('assert');
var docObj = require(process.cwd()+'/grilled/document-object');
var prismicQuery = require(process.cwd()+'/grilled/prismic-query');
var renderer = require(process.cwd()+'/grilled/render');
var fs = require('vinyl-fs');
var through = require('through2');
var jsdom = require("jsdom");

describe(__filename, function() {
  it('should have rendered the title of the article to an h2', function(done) {
    this.timeout(10000);
    fs.src([process.cwd()+'/tests/render.html'])
    .pipe(docObj.get())
    .pipe(prismicQuery.getPrismicData())
    .pipe(renderer.render())
    .pipe(through.obj(function(file, encoding, callback) {
      jsdom.env(file.contents.toString('utf-8'), function (errors, window) {
        //console.log('file.path: '+file.path, '\nprocessing: '+process.cwd()+'/static/tests/tune-in-to-your-reader/index.html')
        if(file.path === process.cwd()+'/static/tests/before-you-start/index.html') {
          var $ = require('jquery/dist/jquery')(window);
            assert.equal('Before You Start', $("h2").text());
            done();
        }

        }
      );
    }))
  })

  // test whether or not we get more than one file 
  // if the doc has a document property
})