function caller(str, cb) {
  console.log('2. called caller');
  cb('Hello World'+str);
  ///return 'Hello World'+str;
}

function ex(cb) {
  console.log('1. exe called');
  var str = ' -- edited';
  caller(str, function(str) {
    console.log('3. callback made')
    cb(str);
  })
}

ex(function(str) {
  console.log(str);
});