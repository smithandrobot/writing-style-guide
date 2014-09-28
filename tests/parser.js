var assert = require('assert');
var parser = require(process.cwd()+'/grilled/parser');
var parserStrings = require(process.cwd()+'/tests/parser.strings');
var fs = require('fs');
var through = require('through2');
var fs = require('vinyl-fs');

describe(__filename, function() {
  it('should parse [table][end table] to an html table', function() {
    var renderedTable = parser.parseTables(parserStrings.rawTable());
    assert.equal(renderedTable, parserStrings.renderedTable());
  });

  it('should parse a "blockquote&gt;" string wrapped in a <pre> to an html blockquote', function(done) {
    var renderedBlockquote = parser.parse(parserStrings.rawBlockquote());
    assert.equal(renderedBlockquote, parserStrings.renderedBlockquote());
    done();
  });
})