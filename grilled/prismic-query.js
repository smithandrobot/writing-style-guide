var through = require('through2');
var Prismic = require("prismic.io").Prismic;

function prismicAPIQuery(docQuery, cb) {  
  Prismic.Api('https://twwritingguide.prismic.io/api', function(err, api) {
    if(err) {
      console.error(err);
      return ;
    }
    var ref = docQuery.ref || api.master();
    var form = docQuery.form || 'everything';
    var apiForm = api.form(form).ref(ref)
    if(docQuery.query) apiForm.query(docQuery.query);

    apiForm.submit(function(err, d) {
      if(cb) cb(d);
    })
  })
}

module.exports = {
  getPrismicData: function(opt) {
    var stream = through.obj(function(file, encoding, callback) {
      var d = file.documentObject;
      if(d.hasOwnProperty('queries')) {
          var queryTotal = d.queries.length;
          var queriesReturned = 0;
          d.queries.forEach(function(queryObj, index) {
            prismicAPIQuery(queryObj, function(queryResult) {
              ++queriesReturned;
              d[queryObj.bind] = queryResult;
              if(queriesReturned === queryTotal) {
                delete d.queries;
                this.push(file);
                callback();
              }
            }.bind(this))
          }.bind(this))
      } else {
        console.warn(file.path, ' has no queries');
        this.push(file);
        callback();
      }
    })
    return stream
  }
}
