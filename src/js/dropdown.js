$(function() {
  $('.hero-banner__nav__ul>li').on('mouseover', handleNavRollover);
  $('.hero-banner__nav__ul > li').on('mouseout', handleNavRollout);
  $panels = $('.hero-banner__nav__panel');

  var $header = $('.hero-banner--writing-guide');
  var timeoutInt = null;

  function handleNavRollover(event) {
    if(timeoutInt) clearTimeout(timeoutInt);
    $this = $(this);
    var x = $this.position().left;
    var y = $header.height()+$header.offset().top
    var $panel = $this.find('.hero-banner__nav__panel');
    var padding = parseInt($panel.css('padding-left'));

    closeAllPanels($panel);
    $panel.css({left:(x-padding)+'px', top: y+'px'});
    $panel.prepareTransition().addClass('hero-banner__nav__panel--visible');
  }

  function closeAllPanels(focusedPanel) {
    $.each($panels, function(index, panel) {
      var $panel = $(panel);
      if(panel !== focusedPanel && $panel.css('opacity') > 0) {
        $panel.prepareTransition().removeClass('hero-banner__nav__panel--visible');
      }
    })

  }

  function handleNavRollout(event) {
    var $panel = $(this).find('.hero-banner__nav__panel');
    timeoutInt = setTimeout(function() {
      $panel.prepareTransition().removeClass('hero-banner__nav__panel--visible');
    }, 250)
  }

});