/***********************************************
*   @namespace - jQuery.fn.hoverScroller
*   @description  - this plugin creates a skinable animated select box
***********************************************/
//
// create closure
//
(function(jQuery) {



    var iMouseX = 0;
    var iMouseY =0;
    var iHeight = 0;
    var iScrollHeight = 0;
    var oUpperBounds = null;
    var oLowerBounds = null;
    var intScroller = null;
    var eCurrentScrollElement = null;
    /***********************************************
    // jQuery.fn.Template : class constructor (description)
    ***********************************************/
    jQuery.fn.hoverScroller = function(options, fnClick, fnStart, fnEnd){
        var opts = jQuery.extend({}, jQuery.fn.hoverScroller.defaults, options);

        // iterate and add event to each matched element
        return $(this).each(function(iIndex, element) {
            //identify the element for caching
            $(element).bind("mouseenter", setUpHoverScroller);
        });
    };

    /***********************************************
    *   @function - jQuery.fn.hoverScroller.setUpHoverScroller
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var setUpHoverScroller = function()
    {
        eCurrentScrollElement = this;
        iHeight = $(this).height();
        iScrollHeight = $(this).get(0).scrollHeight;
        
        if(iScrollHeight > iHeight) {
            var oOffset = $(this).offset();
            oUpperBounds = {
                start: oOffset.top,
                stop: oOffset.top + (iHeight / 3)
            };
            oLowerBounds = {
                start: (oOffset.top+iHeight)-(iHeight/3),
                stop: oOffset.top+iHeight
            };
            $(this).bind("mousemove",hoverScrollCoords);
            $(this).bind("mouseleave", removeHoverScroller);
            intScroller = setInterval(hoverScroll, 50);
        }
    };
    /***********************************************
    *   @function - jQuery.fn.hoverScroller.hoverScroll
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var hoverScroll = function()
    {
        var iScrollAmount = 0;
        var iScrollMultiplier = 0.5;
        if(iMouseY > oUpperBounds.start
        && iMouseY < oUpperBounds.stop)
        {
            //mouse is in the top boundary
            iScrollAmount = (oUpperBounds.stop -iMouseY)*-iScrollMultiplier;

        } else if(iMouseY > oLowerBounds.start
        && iMouseY < oLowerBounds.stop)
        {
            //mouse is in the bottom boundary
            iScrollAmount = (iMouseY -oLowerBounds.start)*iScrollMultiplier;
        }
        $(eCurrentScrollElement).get(0).scrollTop += iScrollAmount;

    };
    /***********************************************
    *   @function - jQuery.fn.hoverScroller.hoverScroll
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var hoverScrollCoords = function(event)
    {
       iMouseX = event.pageX;
       iMouseY = event.pageY;
    };
    /***********************************************
    *   @function - jQuery.fn.hoverScroller.hoverScroll
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var removeHoverScroller = function(event)
    {
       clearInterval(intScroller);
       $(this).unbind("mousemove",hoverScrollCoords);
       $(this).unbind("mouseleave", removeHoverScroller);
       
    };

    /***********************************************
    // Define the plugin defaults
    ***********************************************/
    jQuery.fn.hoverScroller.defaults = {
        iExampleInteger : 1,
        sExampleString : "string",
        bExampleBoolean : true,
        eExampleElement : document.createElement("div"),
        oExampleObject : {},
        aExampleArray : [],
        fExampleFunction : jQuery.fn.hoverScroller.exampleMethod
    };

})(jQuery);



