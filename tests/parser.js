var assert = require('assert');
var parser = require(process.cwd()+'/src/parser');
var parserStrings = require(process.cwd()+'/tests/parser.strings');

describe(__filename, function() {
  it('should parse string between [table][end table] token to an html table', function() {
    var regEx = />\s+</g;
    var rawTable = parserStrings.rawTable();
    var renderedTable = parser.load(rawTable).parseTables().html().replace(regEx, '><');
    assert.equal(renderedTable, parserStrings.renderedTable().replace(regEx, '><'));
  });

  it('should parse a "blockquote&gt;" string wrapped in a <pre> to an html blockquote', function(done) {
    var rawQuote = parserStrings.rawBlockquote();
    var renderedBlockquote = parser.load(rawQuote).parseBlockquotes().html();
    assert.equal(renderedBlockquote, parserStrings.renderedBlockquote());
    done();
  });
})