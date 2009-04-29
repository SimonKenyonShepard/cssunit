var cssUnit = {};
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
   
       var iHeight = 0;
       var sMainRef = "#cssUnit";
       var sCurrentClass = ".current";
       var iListInitalSize = 0;
   
    /***********************************************
    // cssUnit.Template : class constructor (description)
    ***********************************************/
    cssUnit.mainPanel = function(){
        $(sMainRef+" li").bind("mouseenter", function() {
				$(this).stop().animate({opacity : 1});
			}).bind("mouseleave", function() {
				if(!$(this).hasClass(sCurrentClass)) {
					$(this).stop().animate({opacity : 0.5});
				}
			});
            iListInitalSize = $("#cssUnit ul li").eq(0).height();
            
            setContentSize();
            $(window).bind("resize", setContentSize);
            
            $("#cssUnit li").click(selectPane).eq(0).trigger("mouseover").trigger("click");
            
            
            //call the other constructors
            cssUnit.testData();
            cssUnit.testProfile();            
            cssUnit.selectors();
            cssUnit.fileManager();
            cssUnit.testRunner();
            
    };
    
    /***********************************************
    *   @function - getContentSize
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var setContentSize = function()
    {
      iHeight = $("#cssUnit").height()
          - $("#cssUnit h2").height()
          -iListInitalSize*3
          - 95;
      //look for any currents to resize 
      $(sMainRef+" "+sCurrentClass+" .content").css({height : iHeight});
    };
    
    /***********************************************
    *   @function - selectPane
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var selectPane = function()
    {
        if(!$(this).hasClass(".current")) {
            $(this).parent().find(".current").removeClass("current");
            $(this).addClass("current");
            $(this)
                .parent()
                    .find("li:not(.current) .content")
                        .stop()
                        .animate({height: 0}, 300, null,
                            function() {
                                $(this).css({display: "none"});
                                }
                        );
            $(this).find(".content").stop().css({display: "block"}).animate({height: iHeight});
            $(this).parent().find("li:not(.current)").animate({opacity: 0.5});
         }
    };
	
  /***********************************************
    *   @function - cssUnit.mainPanel.retractPane
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.mainPanel.retractPane = function()
    {
        $(sMainRef).stop().animate({
            opacity: 0.2,
            left: "-150px"
		});
        $(sMainRef).bind("mouseenter", cssUnit.mainPanel.expandPane);
    };
    
  /***********************************************
    *   @function - cssUnit.mainPanel.retractPane
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.mainPanel.expandPane = function()
    {
        $(sMainRef).unbind("mouseenter", cssUnit.mainPanel.expandPane);
        $(sMainRef).stop().animate({
            opacity: 1,
            left: "0"
		});
    };

    /***********************************************
    *   @function - examplePublicMethod
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var examplePrivateMethod = function()
    {
        //examples of how to type variable names so it is obvious what datatype they are.
        var aExampleArray = [];
        var bExampleBoolean = true;
        var dExampleDate = true;
        var eExampleElement = document.createElement("div");
        var fExampleFunction = trs.Initials.exampleMethod;
        var frExampleFragment = document.createDocumentFragment();
        var iExampleInteger = 1;
        var oExampleObject = {};
        var sExampleString = "string";
        var toExampleTimeOut = setTimeout();
        var inExampleInterval = setInterval();
    };

    /***********************************************
    *   @function - cssUnit.mainPanel.examplePublicMethod
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.mainPanel.examplePublicMethod = function()
    {
        //examples of how to type variable names so it is obvious what datatype they are.
        var aExampleArray = [];
        var bExampleBoolean = true;
        var dExampleDate = true;
        var eExampleElement = document.createElement("div");
        var fExampleFunction = trs.Initials.exampleMethod;
        var frExampleFragment = document.createDocumentFragment();
        var iExampleInteger = 1;
        var oExampleObject = {};
        var sExampleString = "string";
        var toExampleTimeOut = setTimeout();
        var inExampleInterval = setInterval();
    };

    /***********************************************
    // Define the notional plugin constants
    ***********************************************/
    cssUnit.mainPanel.constants = {};

    /***********************************************
    // Define the plugin cache
    ***********************************************/
    cssUnit.mainPanel.cache = {};

})(cssUnit);



