var assert = require('assert');
var docObj = require(process.cwd()+'/grilled/document-object');
var fs = require('fs');
var through = require('through2');
var fs = require('vinyl-fs');


describe(__filename, function() {
  var obj = { "title" : "Title set in Document", "name" : "David set in Document", "layout" : "main", "queries": [{"bind": "blogPosts", "query": "[[:d= at(document.type,\"blog\")]]"}, {"bind": "locations", "query": "[[:d= at(document.type,\"location\")]]"}]};
  var file = process.cwd()+'/tests/*.html';
  var filePath = '';
  var testDocObj = {};

  describe('#document obj', function() {
    var file = process.cwd()+'/tests/test.html';
    var filePath = undefined;
    var testObj = {
                      "title" : "Title set in Document",
                      "name" : "David set in Document",
                      "layout" : "main",
                      "queries": [
                            {"bind": "articles", "query": "[[:d= at(document.type,\"article\")]]"}
                             ]
                      };
    it('test file should exist', function(done) {
      fs.src([file])
      .pipe(docObj.get())
      .pipe(through.obj(function(f, e, c) {
        assert.strictEqual(process.cwd()+'/tests/test.html', f.path);
        done();
      }))
    })

    it('document object should return a vaild object', function(done) {
      fs.src([file])
      .pipe(docObj.get())
      .pipe(through.obj(function(f, e, c) {
        assert.equal(typeof f.documentObject, 'object');
        assert.deepEqual(f.documentObject, testObj);
        done();
      }))
    })
  })

})