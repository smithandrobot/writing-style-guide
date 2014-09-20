$(function() {

  var $rows;
  var $headers;

  $('table').each(function() {
    var $table = $(this);
    $headers = $table.find('th');
    $rows = $('tbody tr');
  });

  // we don't have any tables on this page
  if($rows === undefined) return;

  $rows.each(function() {
    var $row = $(this),
        $cells = $row.find('td');

    $cells.each(function(index) {
        $(this).attr('data-header-text', $headers.eq(index).text());
    });
  });
});