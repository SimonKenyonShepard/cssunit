/***********************************************
*   @namespace - jQuery.fn.dragLite
*   @description  - this plugin creates a skinable animated select box
***********************************************/
//
// create closure
//
(function(jQuery) {

    var sCurrentID = "";
    /***********************************************
    // jQuery.fn.dragLite : class constructor (description)
    ***********************************************/
    jQuery.fn.dragLite = function(options) {
        var opts = jQuery.extend({}, jQuery.fn.dragLite.defaults, options);

        // iterate and add event to each matched element
        return $(this).each(function(iIndex, element) {
            //identify the element for caching
            jQuery(element).identify();
            var sID = jQuery(element).attr("id");
            jQuery.fn.dragLite.cache[sID] = {};
            jQuery.fn.dragLite.cache[sID].oDefaults = opts;

            //get the dimensions and offsets to store for later
            jQuery.fn.dragLite.cache[sID].oDefaults.iParentWidth = $(element).parent().width();
            jQuery.fn.dragLite.cache[sID].oDefaults.iParentHeight = $(element).parent().height();
            jQuery.fn.dragLite.cache[sID].oDefaults.iParentOffset = $(element).parent().offset();
            jQuery.fn.dragLite.cache[sID].oDefaults.iDraggableWidth = $(element).width();
            jQuery.fn.dragLite.cache[sID].oDefaults.iDraggableHeight = $(element).height();

            $(element).bind("mousedown", startDrag);
            $(element).bind("click", function(event) {event.preventDefault();});

            //test the element to make sure it is correctly positioned
            if($(element).css("position") === "static")
            {
                $(element).css({
                    position: "relative"
                });
            }

        });
    };

    /***********************************************
    *   @function - startDrag
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var startDrag = function(event)
    {
        sID = $(event.target).attr("id");
        $(document.body).bind("mousemove", {eDragTarget: event.target}, dragElement);
        $(document.body).bind("mouseup", {eDragTarget: event.target}, stopDrag);
        $(document.body).bind("mouseleave", {eDragTarget: event.target}, stopDrag);
        if (jQuery.fn.dragLite.cache[sID].oDefaults.start) {
            jQuery.fn.dragLite.cache[sID].oDefaults.start(event.target);
        }
        return false;
    };

    /***********************************************
    *   @function - jQuery.fn.stretchPanel.stopDrag
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var stopDrag = function(event)
    {
        $(document.body).unbind("mousemove", dragElement);
        $(document.body).unbind("mouseup", event.target, stopDrag);
        $(document.body).unbind("mouseleave", event.target, stopDrag);
        if(jQuery.fn.dragLite.cache[sID].oDefaults.stop)
        {
            //do the call back and give back the element
            jQuery.fn.dragLite.cache[sID].oDefaults.stop(event.data.eDragTarget);
        }

        return false;

    };

    /***********************************************
    *   @function - dragElement
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var dragElement = function(event)
    {
        event.preventDefault();
        //work out where the mouse is in relation to the parent DIV
        var elementLeft = event.pageX - jQuery.fn.dragLite.cache[sID].oDefaults.iParentOffset.left;
        var elementTop = event.pageY - jQuery.fn.dragLite.cache[sID].oDefaults.iParentOffset.top;
        var oNewStyles = {};
        if(jQuery.fn.dragLite.cache[sID].oDefaults.contained) {
            if(elementLeft < 0) {
                elementLeft = 0;
            }

            if(elementLeft > jQuery.fn.dragLite.cache[sID].oDefaults.iParentWidth-jQuery.fn.dragLite.cache[sID].oDefaults.iDraggableWidth) {
                elementLeft = jQuery.fn.dragLite.cache[sID].oDefaults.iParentWidth-jQuery.fn.dragLite.cache[sID].oDefaults.iDraggableWidth;
            }

            if(elementTop < 0) {
                elementTop = 0;
            }

            if(elementTop > jQuery.fn.dragLite.cache[sID].oDefaults.iParentHeight-jQuery.fn.dragLite.cache[sID].oDefaults.iDraggableHeight) {
                elementTop = jQuery.fn.dragLite.cache[sID].oDefaults.iParentHeight-jQuery.fn.dragLite.cache[sID].oDefaults.iDraggableHeight;
            }

        }

        if(jQuery.fn.dragLite.cache[sID].oDefaults.axis.indexOf("x") !== -1) {
            oNewStyles.left =  elementLeft;
        }
        if (jQuery.fn.dragLite.cache[sID].oDefaults.axis.indexOf("y") !== -1) {
            oNewStyles.top =  elementTop;
        }
        $("#"+sID).css(oNewStyles);

        if(jQuery.fn.dragLite.cache[sID].oDefaults.move)
        {
            jQuery.fn.dragLite.cache[sID].oDefaults.move(event.target);
        }
        return false;
    };

    /***********************************************
    // Define the plugin defaults
    ***********************************************/
    jQuery.fn.dragLite.defaults = {
        contained : true,
        axis : "xy"
    };

    /***********************************************
    // Define the plugin cache
    ***********************************************/
    jQuery.fn.dragLite.cache = {};

})(jQuery);



