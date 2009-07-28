/***********************************************
*   @namespace - cssUnit
*   @description  - this is a template for cssUnit modules
***********************************************/
//
// create closure
//
(function(cssUnit) {


    
    /***********************************************
    // private variables
    ***********************************************/
   
   var eTestHarness = null;
   var displayBoxDetails = {};
   var largeBoxHeight = 0;
        
    cssUnit.displayTestResults = function(event) {
        eTestHarness = cssUnit.getTestHarness();
        eTestHarness.location.href=event.data.sPage;
        $("#testEnvironment").bind("load", {aTested : event.data.aTested, sSelector : event.data.sSelector}, insertDetails);
    };
    
    var insertDetails = function(event) {
        
        var sScriptPath = window.location.pathname.replace(/cssUnit\.html/, "")+"../resources/css/cssUnit_inject.css";
        //var sScriptPath = "http://www.trisis.co.uk/resources/css/cssUnit_inject.css";
        $("head", eTestHarness.document).append('<link rel="stylesheet" href="'+sScriptPath+'" type="text/css"/>');
        $("body", eTestHarness.document).append('<div class="cssUnitOverlay"></div>');
        cssUnit.mainPanel.retractPane();
        
        for(var i=0; i<event.data.aTested.length; i++) {
            if(!event.data.aTested[i].bPassed) {
                var eCurrentFailSubject = $(event.data.sSelector, eTestHarness.document).eq(event.data.aTested[i].iElementIndex);
                var sTestData = generateDetails(event.data.aTested[i], event.data.sSelector, i, eCurrentFailSubject);
                var eTestData = $(sTestData, eTestHarness.document);
                $("body", eTestHarness.document).append(eTestData);
                eTestData.toggle(showFailDetails, hideFailDetails, {test : true});
                var mouseEvents = function(eCurrentFailSubject) {
                    var currentElement = eCurrentFailSubject;
                    eTestData.hover(function() {
                        currentElement.css({outline: "1px dashed red"});
                    }, function() {
                        currentElement.css({outline: "0"});
                    });
                }(eCurrentFailSubject);
            }
        }
        $("#testEnvironment").unbind("load", insertDetails);
        
    };
    
    var generateDetails = function(oData, sSelector, iTestNo, eCurrentFailSubject) {
        //must be output as a string becuase IE won't allow elements created in one document to be appended to another in an iframe
        var sType="cssUnitPass";
        var sDetails = null;
            eCurrentFailSubject.css({zIndex: 9999999, position: "relative"});
            sType = "cssUnitFail";
            var oOffsets = eCurrentFailSubject.offset();
            var iWidth = eCurrentFailSubject.width();
            var sDetailsContent = '<div class="details"><span><strong>Element:</strong>'+sSelector+'</span><span><strong>Expected:</strong>'+oData.sExpected+'</span><span><strong>Actual:</strong>'+oData.sActual+'</span></div>';
            sDetails = '<div class="cssUnitInfo '+sType+'" style="top:'+oOffsets.top+'px; left: '+(oOffsets.left+iWidth)+'px;"><span class="pointer"></span><div class="wrapper"><strong>'+iTestNo+'</strong>'+sDetailsContent+'</div></div>';
        return sDetails;
    };
    
    var showFailDetails = function(event) {
        var eWrapper = $(".wrapper", this);
        getSmallBoxSizeDetails(eWrapper);
        getLargeBoxHeight($(this));
        eWrapper.animate({
            width: 150,
            height: largeBoxHeight,
            left: -75,
            top: -50
        }, 300, 'easeOutBounce', function() {
           $(this).find(".details").fadeIn("normal");
           $(this).find("> strong").css({textAlign: "left"});
        });
    };
    
    var hideFailDetails = function() {
        var that = this;
        $(".details", this).fadeOut("fast", function() {
           $(".wrapper", that).find("> strong").css({textAlign: "center"});
            $(".wrapper", that).animate({
                width: displayBoxDetails.width,
                height: displayBoxDetails.height,
                left: displayBoxDetails.left,
                top: displayBoxDetails.top
            }, 300, 'easeOutBounce');
        });
        
    };
    
    var getLargeBoxHeight = function(element) {
        var testElement = element.clone();
        testElement
            .appendTo(eTestHarness.document.body)
            .find(".wrapper")
            .css({visibility: "hidden", height: "auto", width: 150})
            .end()
            .find(".details")
            .css({display:"block"});
        largeBoxHeight = testElement.find(".wrapper").height();
        testElement.remove();
    };
    
    var getSmallBoxSizeDetails = function(element) {
        displayBoxDetails.height = element.height();
        displayBoxDetails.width = element.width();
        displayBoxDetails.left = element.position().left;
        displayBoxDetails.top = element.position().top;
    };
    

})(cssUnit);



