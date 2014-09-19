var through = require('through2');

module.exports = {
  get : function(opt) {
    var stream = through.obj(function(file, encoding, callback) {
      var data = [];
      var regex = new RegExp(/<script.*?data-binding=\"document\".*?>([\S\s]*)<\/script>/)
      var match = regex.exec(file.contents.toString('utf-8'));
      var obj = (match !== null) ? JSON.parse(match[1]) : {};
      file.documentObject = obj;
      this.push(file);
      callback();
    });

    return stream;
  }
}