var through = require('through2');
var vinylFile = require("vinyl");
var h = require('handlebars');
var fs = require('fs');
var pageOrder = require('./page-order');

function registerPartials(opt, callback) {
  if(opt) {
    var partialsDir = opt.partialsDir || process.cwd()+'src/_partials/';
  }else {
    var partialsDir = process.cwd()+'/src/_partials/';
  }

  fs.readdir(partialsDir, function(err, d) {
    var totalPartials = d.length;
    var currentPartial = 0;

    d.forEach(function(data, index) {
      var name = data.replace('.html', '');
      
      fs.readFile(partialsDir+data, 'utf-8', function(err, partialData) {
        if(err) console.log(err);
        ++currentPartial;
        h.registerPartial(name, partialData);
        if(currentPartial === totalPartials) {
          callback();
        }
      })
    })
  })
}

function addLayout(str, obj, cb) {
  if(!obj.hasOwnProperty('layout')) {
    cb(str);
    return;
  }
  fs.readFile(process.cwd()+'/src/_layouts/'+obj.layout+'.html', 'utf-8', function(err, data) {
    var newStr = data.replace(/\{\{.*content.*\}\}/, str);
    cb(newStr);
  })
}

function renderFile(str, file, callback) {
  var tpl = h.compile(str);
  var rendered = tpl(file.documentObject);
  file.contents = new Buffer(rendered);
  callback();
}


function linkResolver(ctx, documentLink) {
  var url = ctx.pageOrder.indexOfURL(documentLink.slug);
  if(url) {
    return url;
  }
  var rootDir = '/'
  return rootDir+documentLink.slug+'/index.html';
}


function registerHelpers() {

  h.registerHelper('prismicContext', function(obj, method, args) {
    if(obj === undefined) return;
    return obj[method](args);
  });

  h.registerHelper('getHTML', function(obj, fragment) {
    if(obj === undefined) return;
    var parser = require('./parser');
    var html = obj.get(fragment).asHtml({linkResolver: linkResolver, pageOrder: pageOrder});
    html = html.replace(/\n/g, '<br>');
    var result = parser.parse(parser.parseTables(html));
    return result;
  });
}

var getRelatedLink = function(title, offset) {
  var currentIndex = pageOrder.indexOf(title);
  var link = pageOrder.linkAt(currentIndex + offset);
  return link;
};

module.exports = {
  render: function(opt) {

    registerHelpers();

    var stream = through.obj(function(file, encoding, callback) {
      registerPartials(opt, function() {
        if(file.documentObject.hasOwnProperty('document')) {
          if(file.documentObject.document.results.length > 0) {
            var totalDocs = file.documentObject.document.results.length;
            var currentDocCount = 0;
            // loop through the results and make a document for each result
            file.documentObject.document.results.forEach(function(doc, index) {
              var dest = process.cwd()+'/static/';
              var parentFolder = file.path.split('/');
              parentFolder = parentFolder[parentFolder.length-2]+'/';
              var slug = doc.slug;

              if(slug+'/' === parentFolder) {
                slug = '';
              }

              addLayout(file.contents.toString('utf-8'), file.documentObject, function(str) {
                ++currentDocCount;
                var tpl = h.compile(str);
                
                var variables = {};
                variables.prismicDocument = doc;
                variables.prismicDocument.parentDocument = parentFolder;
                variables.backLink = getRelatedLink(doc.getText('page.title'), -1);
                variables.nextLink = getRelatedLink(doc.getText('page.title'), 1);
                var rendered = tpl(variables);
                var newFileObj = new vinylFile( {cwd: file.cwd, base: file.base, path: dest+parentFolder+slug+'/index.html', contents: new Buffer(rendered)});
                file.contents = new Buffer(rendered);
                this.push(newFileObj);
                if(currentDocCount === totalDocs) {
                  callback();
                }
              }.bind(this))
            }.bind(this))
          } else {
            this.push(file);
            callback();
          }
        }else{
          console.log(file.path, ' has no results')
          addLayout(file.contents.toString('utf-8'), file.documentObject, function(str) {
            file.documentObject = file.documentObject || {};
            var tpl = h.compile(str);
            var rendered = tpl(file.documentObject);
            file.contents = new Buffer(rendered);
            this.push(file);
            callback();
          }.bind(this))
        }
      }.bind(this));
    })

    return stream;
  }
}
