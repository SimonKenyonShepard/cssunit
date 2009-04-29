/**
 * @author Alexander Farkas
 * v. 1.02
 */
(function($) {
	
	function getElementBgValues(fx){
		   var start = $(fx.elem).css("backgroundPosition") || "0 0";
           start = start.replace(/[px|pt]/g, '');
           return start.split(" ");
	}
    $.extend($.fx.step,{
        backgroundPositionX : function(fx) {
            if (fx.state === 0) {
                var start = getElementBgValues(fx);
                fx.start = parseInt(start[0], 10);
                fx.Ypos = parseInt(start[1], 10);
            }
            
            fx.elem.style.backgroundPosition = fx.now+'px '+fx.Ypos+"px";
        },

        backgroundPositionY : function(fx) {
            if (fx.state === 0) {
                var start = getElementBgValues(fx);
                fx.start = parseInt(start[1], 10);
                fx.Xpos = parseInt(start[0], 10);
            }
            fx.elem.style.backgroundPosition = fx.Xpos+'px '+fx.now+"px";
        }
    });
})(jQuery);
