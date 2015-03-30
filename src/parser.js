var cheerio = require('cheerio');

var html = '';

function parseBlockquote(str) {
  str = str.replace('blockquote&gt;', '');
  return '<blockquote>'+str+'</blockquote>'
}


function parsePre(str) {
  if(str.indexOf('<pre>') === -1) return str
  var re = /(?:<pre>)(.*?)(?:<\/pre>)/g;
  str = str.replace(re, function(a, b) {
    return parseBlockquote(b);
  })
  return str;
}

/*
 * Finds the [table]...[end table] tokens and puts its content through <table> conversion.
*/
function parseTables(str) {
  if(str.indexOf('[table')> -1) {
    str = str.replace(/\n/g, '');
    var re = /(?:\[table.*?\])(.*?)(?:\[end table\])/g;
    str = str.replace(re, function(a, b, c, d) {
      b = b.replace(/<(|\/)p>/g, ''); // remove paragraphs
      var tableHTML = parseTable(b);
      return tableHTML;
    });
    html = str;
    return;
  }

  html = str;
}

/*
 * Reads and converts a prismic document that has the [table]...[end table] tokens.
*/
function parseTable(str) {
  var $ = cheerio.load(str);
  var $ul = $('ul');
  var $li;
  var $text;

  var columnCount = $($ul[0]).find('li').length;
  var content = '<table class="style-guide-table style-guide-table--'+columnCount+'-column">'
  $ul.each(function(index, val) {
    if(index === 0) {
      content += '<thead><tr>'+$(val).html().replace(/li>/g, 'th>')+'</tr></thead><tbody>'
    }else{
      $(val).find('li').each(function(index, li) {
        $text = $(li).text();
        $(li).html(formatTableData(index, columnCount, $text))
      })
     content += '<tr>'+$(val).html().replace(/li>/g, 'td>')+'</tr>' ;
    }
  });
  content += '</tbody></table>';
  return content;
}
/*
  Adds the arrow formatting to the 1st or 2nd <td> depending on the amount of columns
*/
function formatTableData(index, columnCount, text) {
  var template = '<div>'+text+'</div>';
  var arrow = '<div class="style-guide-table__arrow"></div>';

  if(index === 0 && columnCount == 2 || index === 1 && columnCount == 3) {
    return template+arrow;
  }

  return template;
}

module.exports = {
  load: function(str) {
    html = str;
    return this;
  },

  parseBlockquotes: function() {
    html = parsePre(html)
    return this;
  },

  parseTables: function() {
    parseTables(html);
    return this;
  },

  html: function() {
    return html;
  }
}