var fs = require('fs');
var jsdom = require("jsdom");
var deasync = require('deasync');


function parseBlockquote(str) {
  str = str.replace('blockquote>', '');
  return '<blockquote>'+str+'</blockquote>'
}



function parsePre(str) {
  str = str.replace(/\n/g, '')
  var pString = str.split(/<pre>(.*?)<\/pre>/);
  
  pString.forEach(function(str2, index) {
    if(index%2) {
        pString[index] = parseType(str2);
      }
  })
  return pString.join('');
}

function renderTable(str, cb) {
  var html = undefined;
  
  jsdom.env(str, function (errors, window) {
    var $ = require('jquery/dist/jquery')(window);
    var uls = $('ul');

    $.each(uls, function(a, b) {
      html = '<table class="style-guide-table">\n  <thead>\n';
      html +='    <tr>';
      lis = $(this).find('li');
      liTotal = lis.length;

      $.each($(this).find('li'), function(liIndex, liData) {
        //console.log('a: ', a)
        if(a===0) {
          html += '\n      <th>'+$(this).html()+'</th>'
        }else{
          html += '\n      <td>'+$(this).html()+'</td>'
        }
      })
      if(a===0) {
        html += '\n    </tr>\n  </thead>\n  <tbody>';  
      }else{
        html += '\n  </tr>\n';  
      }
    })
    html += '</tbody>\n</table>';
  })

  while(html===undefined) {
    require('deasync').runLoopOnce();
  }

  return html;
}

function parseTable2(str, cb) {
  if(typeof str !== 'string') return 'str is not a string!';
  var parsed = false;

  if(str.indexOf('[table]')> -1) {
    
    str = str.replace(/\n/g, '');
    var re = /(?:\[table.*?\])(.*?)(?:\[end table\])/g;
    str = str.replace(re, function(a, b, c, d) {
      //console.log(b)
      b = b.replace(/<(|\/)p>/g, '');
      var tableHTML = renderTable(b);
      //
      return tableHTML;
    });
    return str;
  }else{
    return str;
  }
}

function parseType(str) {
  if(str.indexOf('blockquote>') > -1) return parseBlockquote(str);
}


var mod = {
  parse: function(str) {
    var str = parsePre(str);
    return str;
  },

  parse2: parseTable2


}

module.exports = mod;
