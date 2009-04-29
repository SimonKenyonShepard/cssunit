(function(jQuery) {

    jQuery.fn.delay = function(fnAction) {

        var iInterval = jQuery.fn.delay.defaults.iInterval;
        var oEventData = {};

        //partial evaluation to see whether we have arguments to pass into the call
        if(arguments[1]) {
            iInterval = arguments[1];
        }
        if ((typeof arguments[1]).toString() === "object") {
            oEventData = arguments[1];
            if (arguments[2]) {
                iInterval = arguments[2];
            }
        }
        // iterate and add event to each matched element
        return $(this).each(function(iIndex, element) {
            jQuery(element).clearDelay(jQuery.fn.delay.constants.sDataName);
            if(iInterval > 0) {
                $(element).data(jQuery.fn.delay.constants.sDataName, setTimeout(function() {

                    fnAction(oEventData);

                }, iInterval));
            } else {
                fnAction(oEventData);
            }

        });
    };
    jQuery.fn.clearDelay = function(sDataName) {
        // iterate and add event to each matched element
        return $(this).each(function(iIndex, element) {
            var sID = $(element).attr("id");

            if(!sDataName) {
                sDataName = jQuery.fn.delay.constants.sDataName;
            }
            if($(element).data(sDataName)) {
                clearTimeout($(element).data(jQuery.fn.delay.constants.sDataName));
                $(element).data(jQuery.fn.delay.constants.sDataName, null);
            }
        });
    };
    jQuery.fn.delay.defaults = {
        iInterval : 1000
    };
    jQuery.fn.delay.constants = {
        sDataName : "delayedActions"
    };

})(jQuery);



