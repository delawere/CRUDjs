'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 200;
  var lastTimeout;

  var debounce = function (callback) {
  	if (lastTimeout) {
  		clearTimeout(lastTimeout);
  		lastTimeout = null;
  	}
  	lastTimeout = setTimeout(callback, DEBOUNCE_INTERVAL);
  };

  window.debounce = debounce;
})();
