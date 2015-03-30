var prismicDoc = require(process.cwd()+'/tests/prismic-document-mock');
var helpers = require(process.cwd()+'/src/helpers.js');
var assert = require('assert');
var fs = require('fs');


describe(__filename, function() {
  var homepage = prismicDoc.getDoc('homepage', 'Homepage', '/');
  var doc1 = prismicDoc.getDoc('1', 'Page 1', 'a/b/1');
  var doc2 = prismicDoc.getDoc('2', 'Page 2', 'a/b/2');
  var doc3 = prismicDoc.getDoc('3', 'Page 3', 'a/b/3');
  doc1.nextArticle(doc2);
  doc2.nextArticle(doc3);
  var docArr = [homepage, doc1, doc2, doc3];
  var cachedDocs = helpers.cacheDocs(docArr);

  it('should store prismic docs in an object with doc id\'s for keys', function(done) {
    assert.deepEqual(cachedDocs['1'], doc1);
    assert.deepEqual(cachedDocs['2'], doc2);
    assert.deepEqual(cachedDocs['3'], doc3);
    done();
  });

  it('should get a next link, but not a back link for a Prismic Document', function(done) {
    var bottomNav = helpers.getBottomNav(doc1);
    assert.deepEqual(bottomNav, { nextLink: {title: 'Page 2', path: '/a/b/2'}, backLink:false });
    done();
  });

  it('should get a back link, but not a next link for a Prismic Document', function(done) {
    var bottomNav = helpers.getBottomNav(doc3);
    assert.deepEqual(bottomNav, { nextLink: false, backLink: {title: 'Page 2', path: '/a/b/2'} });
    done();
  });

  it('should get a back and next link for a Prismic Document', function(done) {
    var bottomNav = helpers.getBottomNav(doc2);
    assert.deepEqual(bottomNav, { nextLink: {title:'Page 3', path: '/a/b/3'}, backLink:{title:'Page 1', path: '/a/b/1'}});
    done();
  });

  it('should produce a link and add a \'/\' to the beginning its path property', function(done) {
    var link = helpers.linkResolver({}, doc1, false);
    assert.strictEqual(link, '/a/b/1');
    done();
  });

  it('should produce a root link without a \'//\' given a document whose path is \'/\'', function(done) {
    var link = helpers.linkResolver({}, homepage, false);
    assert.strictEqual(link, '/');
    done();
  });

  it('should get the first paragraph of a document as a description and its length should be no longer than 200 characters', function(done) {
    var description;
    var descriptionRaw = 'Use active and colourful verbs to breathe life and momentum into your writing and inspire your reader to take action. Avoid passive verbs and "-ing" verbs wherever you can. They are weak and remove...';
    this.timeout(1000);
    fs.readFile(process.cwd()+'/tests/test.html', 'utf8', function (err,data) {
      if (err) {
        done();
        return console.log(err);
      }

      doc1.setContent(data);
      description = helpers.getDescription(doc1);
      assert.equal(description.length, 200);
      assert.strictEqual(description, descriptionRaw);
      done();
    });
  });
})