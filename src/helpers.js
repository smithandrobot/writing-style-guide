var cheerio = require('cheerio');
var parser = require('./parser');
var docs = {};

/**
 Get a document by ID
*/
function getDoc(id) {
  if(docs.hasOwnProperty(id)) {
    return docs[id];
  }
  return undefined;
}

/**
 Look at cached files and see if the passed doc id is linked
 as next in a doc, if so we know this is our "back" link
*/
function getBackLink(doc) {
  var cachedDoc;
  var id = doc.id;
  for(id in docs) {
      cachedDoc = docs[id];
      if(cachedDoc.getLink('page.next_article')) {
        if(cachedDoc.getLink('page.next_article').document.id === doc.id) {
          return {title: cachedDoc.getText('page.title'), 
                  path: '/'+cachedDoc.getText('page.path').replace('//', '/')
                 }
        }
      }
  }
  return false;
}

/**
 Get the next link in a passed in doc
*/
function getNextLink(doc) {
  var nextDoc = doc.getLink('page.next_article');
  if(nextDoc !== null) {
    if(doc.getLink('page.next_article')) {
      var id = doc.getLink('page.next_article').document.id;
      var cachedDoc = getDoc(id);
      var title = cachedDoc.getText("page.title");
      var path = '/'+cachedDoc.getText('page.path').replace('//', '/');
      return { title: title, path: path };
    }
  }
  return false;
}


module.exports = {

  linkResolver: function (ctx, doc, isBroken) {
    var link = '';
    if (isBroken) return '#broken'
      var cachedDoc = getDoc(doc.id)
      if(cachedDoc === undefined ) throw 'Linked document not found in link resolver!';
      link = '/'+cachedDoc.getText('page.path');
      link = link.replace('//', '/'); //special case for homepage url
      return link;
  },

  getBottomNav: function(doc) {
    var obj = {nextLink: getNextLink(doc), backLink: getBackLink(doc)};
    //console.log('{title: "'+doc.getText('page.title')+'", ')
    return obj;
  },

  cacheDocs: function(prisimicDocs) {
    prisimicDocs.forEach(function(doc) {
      docs[doc.id] = doc;
    })
    return docs;
  },

  getHTML: function(doc) {
    if(doc === undefined) return;
    var html = doc.getStructuredText('page.content').asHtml({linkResolver: this.linkResolver});
    html = parser.load(html).parseBlockquotes().parseTables().html();
    return html;
  },

  getDescription: function(doc) {
    if(doc === undefined) return 'ThoughtWorks Writing Style Guide';
    var description = doc.getStructuredText("page.content").getFirstParagraph().text.replace(/\n/g, ' ').substring(0, 197)+'...';
    return (description !== '') ? description : 'ThoughtWorks Writing Style Guide';
  }
}
