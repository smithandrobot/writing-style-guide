var cheerio = require('cheerio');

function prismicDocumentMock(id, title, path) {

  var title;
  var path;
  var page = {};
  page.title = (title || undefined);
  page.path = (path || undefined);

  return { 
    id: id || undefined,

    setTitle: function(str) {
      page.title = str;
      return this;
    },

    setPath: function(str) {
      page.path = str;
      return this;
    },

    setContent: function(str) {
      page.content = str;
      return this;
    },

    nextArticle: function(doc) {
      page.nextArticle = {}
      page.nextArticle.document = doc;
      return this;
    },

    getText: function(str) {
      if(str==='page.path') {
        return page.path;
      }

      if(str === 'page.title') {
        return page.title;
      }
    },

    getLink: function(str) {
      if(str === 'page.next_article') {
        return page.nextArticle;
      }
    },

    getStructuredText: function(str) {
      $ = cheerio.load(page.content);

      if(str === 'page.content') {
        return {
          asHtml: function(linkResolver) {
            return page.content;
          },
          getFirstParagraph: function() {
            return { text: $($('p')[0]).text()};
          }
        };
      }
    }
  }
}

module.exports = {
  getDoc: function(id, title, path) {
    return prismicDocumentMock(id, title, path);
  }
}