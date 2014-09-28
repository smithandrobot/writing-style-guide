var fs = require('fs');
var jsdom = require("jsdom");
var deasync = require('deasync');


function parseBlockquote(str) {
  str = str.replace('blockquote&gt;', '');
  return '<blockquote>'+str+'</blockquote>'
}



function parsePre(str) {
  if(str.indexOf('<pre>') === -1) return str

  var re = /(?:<pre>)(.*?)(?:<\/pre>)/g;
  str = str.replace(re, function(a, b) {
    console.log('stuff inside pre ', b)
    return parseType(b);
  })
  return str;
}

function renderTable(str, cb) {
  var html = undefined;
  // console.log('rendering table: \n'+str)
  jsdom.env(str, function (errors, window) {
    var $ = require('jquery/dist/jquery')(window);
    var uls = $('ul');
    var columnCount = $(uls[0]).find('li').length;
    html = '<table class="style-guide-table style-guide-table--'+columnCount+'-column">\n  <thead>\n';
    var arrow = ''
    $.each(uls, function(a, b) {
      html +='    <tr>'
      $.each($(this).find('li'), function(liIndex) {
        if(a===0) {
          html += '\n      <th>'+$(this).html()+'</th>'
        }else{
          var arrow = (liIndex===0) ? '<div class="style-guide-table__arrow"></div>' : '';
          html += '\n      <td><div>'+$(this).html()+'</div>'+arrow+'</td>'
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
  // console.log('html is: '+html);
  return html;
}

function parseTable(str, cb) {
  if(typeof str !== 'string') return 'str is not a string!';
  var parsed = false;

  if(str.indexOf('[table')> -1) {
    str = str.replace(/\n/g, '');
    var re = /(?:\[table.*?\])(.*?)(?:\[end table\])/g;
    str = str.replace(re, function(a, b, c, d) {
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
  if(str.indexOf('blockquote&gt;') > -1) return parseBlockquote(str);
  return str;
}


var mod = {
  parse: function(str) {
    var str = parsePre(str);
    return str;
  },

  parseTables: parseTable


}

module.exports = mod;
