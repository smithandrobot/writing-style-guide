(function() {
	var hasTouch = 'ontouchstart' in window;
	var html = document.getElementsByTagName('html')[0];
	if (hasTouch) {
		html.className += ' touch';
	} else {
		html.className += ' no-touch';
	}
})();
