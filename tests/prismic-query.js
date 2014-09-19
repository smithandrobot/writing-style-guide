var assert = require('assert');
var docObj = require(process.cwd()+'/grilled/document-object');
var prismicQuery = require(process.cwd()+'/grilled/prismic-query');
var through = require('through2');
var fs = require('vinyl-fs');

describe(__filename, function() {
	it('should have more than 0 results for the article content type', function(done) {
		this.timeout(5000);
		fs.src([process.cwd()+'/tests/test.html'])
		.pipe(docObj.get())
		.pipe(prismicQuery.getPrismicData())
		.pipe(through.obj(function(file, encoding, callback) {
			assert.notEqual(0, file.documentObject.articles.results.length)
			done();
		}))
	})
})