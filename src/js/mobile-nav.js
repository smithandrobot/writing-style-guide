$(function() {
	$buttons = $('.mobile-nav__main img');
  $buttons.on('click', onClick);

  function onClick(e) {
    var $panel = $(this).parent().find('.mobile-nav__main__panel');
    console.log('click', $panel);
    $panel.css({height:'0px'});
  }
});