var rawTableStr = ''+
'[table]'+
'<ul>'+
'	<li>th1</li>'+
'	<li>th2</li>'+
'</ul>'+
'<p></p>'+
'<ul>'+
'	<li>row 1 td1</li>'+
'	<li>row 1 td2</li>'+
'</ul>'+
'<p></p>'+
'<ul>'+
'	<li>row 2 td1</li>'+
'	<li>row 2 td2</li>'+
'</ul>'+
'[end table]';

var renderedTableStr = ''+
'<table class="style-guide-table style-guide-table--2-column">\n'+
'  <thead>\n'+
'    <tr>\n'+
'      <th>th1</th>\n'+
'      <th>th2</th>\n'+
'    </tr>\n'+
'  </thead>\n'+
'  <tbody>\n'+
'    <tr>\n'+
'      <td><div>row 1 td1</div><div class="style-guide-table__arrow"></div></td>\n'+
'      <td><div>row 1 td2</div></td>\n'+
'  </tr>\n'+
'    <tr>\n'+
'      <td><div>row 2 td1</div><div class="style-guide-table__arrow"></div></td>\n'+
'      <td><div>row 2 td2</div></td>\n'+
'  </tr>\n'+
'</tbody>\n'+
'</table>';

var rawBlockquote = '<p>Test stuff.<pre>blockquote&gt;This is a quote.</pre></p>';
var renderedBlockquote = '<p>Test stuff.<blockquote>This is a quote.</blockquote></p>';

module.exports = {
	rawTable: function() {
		return rawTableStr;
	},

	renderedTable: function() {
		return renderedTableStr;
	},

	rawBlockquote: function() {
		return rawBlockquote;
	},

	renderedBlockquote: function() {
		return renderedBlockquote;
	}
}