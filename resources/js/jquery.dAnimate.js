/*
 * jQuery Delayed Animations
 * Simon Kenyon Shepard
 * v1.0
 */
//
// create closure
//
(function(jQuery) {
	//
	// plugin definition
	//
	jQuery.fn.dAnimate = function(prop, speed, easing, callback, iDelay){
		// iterate and animate each matched element
	    return this.each(function() {
			if(iDelay && iDelay !== 0)
			{
				jQuery(this).animate({delayProperty: "1"}, iDelay, null, null).animate(prop, speed, easing, callback);	
			} else {
				jQuery(this).animate(prop, speed, easing, callback);
			}
			
		});
	};

})(jQuery);