$(function() {
  var disclosureButtonClicked = function() {
  	var $parent = $(this).parent();
    var $panel = $parent.find('.mobile-nav__main__panel');
    $parent.toggleClass('js-nav-open');
    $panel.slideToggle();
  };

  var mainButtonClicked = function() {
  	var $menu = $(this).parents('.mobile-nav');
  	var $main = $menu.find('.mobile-nav__main');

  	$menu.toggleClass('js-mobile-nav-open');
  	$main.slideToggle();
  };

  $buttons = $('.mobile-nav__main img');
  $buttons.on('click', disclosureButtonClicked);
  $toggles = $('.mobile-nav__toggle');
  $toggles.on('click', mainButtonClicked)

  $('.mobile-nav .mobile-nav__main').slideUp(0); // closed by default
});
