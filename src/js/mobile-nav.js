$(function() {
  $buttons = $('.mobile-nav__main img');
  $buttons.on('click', onClick);

  function onClick(e) {
  	var $parent = $(this).parent();
    var $panel = $parent.find('.mobile-nav__main__panel');
    $parent.toggleClass('js-nav-open');
    $panel.slideToggle();
  }
});
