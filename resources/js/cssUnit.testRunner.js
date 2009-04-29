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
   
    var sConsoleRef = "#testConsole";
	var sTestRunnerButtonRef = "#runTests";
    var inTestQueue;
    var eCurrentSelector = null;
    var aFiles = [];
    var eTestHarness = null;
    var dTestStart = null;
    var aPasses = [];
    var aFails = [];
   
    /***********************************************
    // cssUnit.testRunner : class constructor (description)
    ***********************************************/
    cssUnit.testRunner = function(sContents){
       $(sTestRunnerButtonRef).click(runTests);
       eTestHarness = $("#testEnvironment").get(0).contentWindow;
        setDefaultWindow();
    };
    
    var setDefaultWindow = function() {
       eTestHarness.location.href="cssUnit_blank.html";
    };
    
    var runTests = function(){
        aFiles = cssUnit.testData.getFiles();
        if(aFiles.length > 0)
        {
            
            $("##cssUnit h2").addClass("testing");
            dTestStart = new Date().getTime();
            
            clearConsole();
            aPasses = [];
            aFails = [];
            $("#testEnvironment").bind("load", newPageLoaded);
            loadNextFile();
        
        } else {
            updateConsole("No files selected!");
            changeConsoleColor(1);
        }
        
    };
    
    var newPageLoaded = function() {
        createTestQueue();
        inTestQueue = setInterval(doTest, 200);
    };
    
    /***********************************************
    *   @function - constructRules
    *   @description  - creates an array of tests for that selector
    *   @param- void
    *   @returns - false
    ***********************************************/
    var createTestQueue = function() {
        cssUnit.testRunner.testQueue = [];
        var oTests = cssUnit.testData.getSelectorData();
        var iTest = 0;
        for(var sSelector in oTests) {
            var aSelectorTests = [];
            for (var sProperty in oTests[sSelector]) {
                var aRules = constructRules(sSelector, sProperty, oTests[sSelector][sProperty]);
                cssUnit.testRunner.testQueue = cssUnit.testRunner.testQueue.concat(aRules);
                
            }
        }
	};
    
    /***********************************************
    *   @function - constructRules
    *   @description  - creates an array of tests for that selector
    *   @param- void
    *   @returns - false
    ***********************************************/
	var constructRules = function(sSelector, sProperty, aRules){
       var aFullRules = [];
       sProperty = sProperty.replace(/_/, "-");
       aFullRules.push({sSelector: sSelector, sProperty: sProperty, aRules : aRules});
       return aFullRules;
    };
    
    /***********************************************
    *   @function - loadNextFile
    *   @description  - Loads the next file in the test harness
    *   @param- void
    *   @returns - false
    ***********************************************/
	var loadNextFile = function(){
        var sNextFile = aFiles.shift();
       updateConsole("Loaded: "+ sNextFile);
       try
       {
           eTestHarness.location.href=sNextFile;
       }
       catch(err) {
           updateConsole("Load failed!: "+ sNextFile);
           aFails.push("Load Failed");
           createSummary();
       }
    };
    
    /***********************************************
    *   @function - doTest
    *   @description  - executes the current test in the queue on the page 
    *   @param- void
    *   @returns - false
    ***********************************************/
	var doTest = function(){
       if(cssUnit.testRunner.testQueue.length !== 0)
       {
           var oCurrentTest = cssUnit.testRunner.testQueue.shift();
           var oElements = $(oCurrentTest.sSelector, eTestHarness.document);
           var aPassesLocal = [];
           var aFailsLocal = [];
           var oTestData = {
                  sPage : eTestHarness.location.href,
                  sSelector : oCurrentTest.sSelector,
                  aTested : []
           };
           var sRules = arrayToString(oCurrentTest.aRules);
           oElements.each(function(iIndex, eElement) {
              
              var sActualValue = $(eElement).css(oCurrentTest.sProperty).toLowerCase();
              var bPassed = false;
              for(var i=0; i<oCurrentTest.aRules.length; i++) {
                  var oCurrentTestData = {sRule : oCurrentTest.aRules[i], sActualValue : sActualValue};
                  //test to see if is color in wrong format
                  testColors(oCurrentTestData);
                  //test to see if it's a dimension in px and to what decimal places
                  testPixels(oCurrentTestData);
                  if(oCurrentTestData.sActualValue === oCurrentTestData.sRule) {
                      bPassed = true;
                  }
              }
              oTestData.aTested.push( {
                  iElementIndex : iIndex,
                  sExpected : sRules,
                  sActual : sActualValue
              });
              if(bPassed) {
                  aPassesLocal.push(oTestData);
              } else {
                  aFailsLocal.push(oTestData);
              } 
           });
           aPasses = aPasses.concat(aPassesLocal);
           aFails = aFails.concat(aFailsLocal);
           updateConsole(oCurrentTest.sSelector+" {"+oCurrentTest.sProperty+":"+sRules+"} <br/> "+aPassesLocal.length+" passes, "+aFailsLocal.length+" fails", oTestData, aFailsLocal.length);
       } else {
           clearInterval(inTestQueue);
           //run the summary function
           if(aFiles.length > 0)
           {
               loadNextFile();
           } else {
               createSummary();
           }
       }
    };
    
	
	/***********************************************
    *   @function - updateConsole
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
	var updateConsole = function(sContents, oTestData, iFails){
        var eNewEntry = $("<li>"+sContents+"</li>");
        if(oTestData) {
            eNewEntry.bind("click", oTestData, displayTestResults);
        }
        if(iFails > 0) {
            eNewEntry.addClass("fail");
        } else {
            eNewEntry.addClass("pass");
        }
       $(sConsoleRef).append(eNewEntry);
	   $(sConsoleRef).get(0).scrollTop = $(sConsoleRef).get(0).scrollHeight;
    };
    
    /***********************************************
    *   @function - clearConsole
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
	var clearConsole = function(){
       $(sConsoleRef).empty();
    };
    
    /***********************************************
    *   @function - createSummary
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
	var createSummary = function(){
       $("##cssUnit h2").removeClass("testing");
       $("#testEnvironment").unbind("load", newPageLoaded);
       var dCurrentTime = new Date().getTime();
       var iTotalTime = dCurrentTime-dTestStart;
       var iTotalTested = aPasses.length + aFails.length;
       updateConsole(iTotalTested + " tests in : "+iTotalTime+" ms <br/>"+aPasses.length+" passed, "+aFails.length+" failed");
       if(aFails.length === 0) {
           changeConsoleColor(0);
           cssUnit.testData.registerPass();
       } else {
           changeConsoleColor(1);
           cssUnit.testData.registerFail();
       }
    };
    
    var changeConsoleColor = function(iType) {
        var sBGColor = "#adeb41";
        switch(iType) {
            case 1 : 
                sBGColor = "#ff393c";
            break
        };
        $("#console").animate({backgroundColor: sBGColor});
    };
    
    var displayTestResults = function(event) {
        eTestHarness.location.href=event.data.sPage;
        $("#testEnvironment").bind("load", {aTested : event.data.aTested, sSelector : event.data.sSelector}, insertDetails);
    };
    
    var insertDetails = function(event) {
        var eOverlay = $("<div></div>");
        var iHeight = $("body", eTestHarness.document).height();
        $(eOverlay).css({
            opacity: 0.8,
            height: iHeight,
            width: "100%",
            backgroundColor: "#000",
            position: "absolute",
            top : 0,
            left: 0,
            zIndex: 99999999
        });
        $("body", eTestHarness.document).append(eOverlay);
        cssUnit.mainPanel.retractPane();
        for(var i=0; i<event.data.aTested.length; i++) {
            var eTestData = generateDetails(event.data.aTested[i], event.data.sSelector);
            //console.log("simon", event);
            $("body", eTestHarness.document).append(eTestData);
        }
        $("#testEnvironment").unbind("load", insertDetails);
    };
    
    var generateDetails = function(oData, sSelector) {
        var sType = "#ff393c";
        if(oData.sExpected === oData.sActual) {
            sType="#adeb41";
        }
        var eDetails = $('<div><span class="pointer"></span><div class="wrapper"><strong>'+sSelector+'</strong><span class="title">Expected : '+oData.sExpected+'</span><span class="title">Actual : '+oData.sActual+'</span></div></div>');
        var oOffsets = $(sSelector, eTestHarness.document).eq(oData.iElementIndex).offset();
        var iWidth = $(sSelector, eTestHarness.document).eq(oData.iElementIndex).width();
        $(sSelector, eTestHarness.document).eq(oData.iElementIndex).css({zIndex: 999999999, position: "relative"});
        eDetails.css({
            position : "absolute",
            top: oOffsets.top,
            left: oOffsets.left+iWidth,
            width: 120,
            height: 70,
            overflow : "hidden",
            zIndex: 999999999
        });
		$(".wrapper", eDetails).css({
			padding: "5px",
			position : "absolute",
			top: 0,
			right: 0,
			backgroundColor: sType,
			width: 105,
			height: 60,
			"-moz-border-radius" : "5px"
		});
		$("span, strong", eDetails).css({
			display: "block"
		});
        $("span.title", eDetails).css({
			borderBottom: "1px dotted #000"
		});
		$(".pointer", eDetails).css({
			position : "absolute",
			top: 10,
			left: 0,
			borderTop : "5px solid transparent",
			borderRight : "5px solid "+sType,
			borderBottom: "5px solid transparent",
			width: 1,
			height: 1
		});
        return eDetails;
    };
    
    var testColors = function(oCurrentTestData) {
        //for different browsers return different styles of color response
        if(oCurrentTestData.sActualValue.indexOf("rgb") !== -1)
              {
                  oCurrentTestData.sActualValue = oCurrentTestData.sActualValue.replace(/([A-Za-z\(\) ])/g, "");
                  var aInts = oCurrentTestData.sActualValue.split(",");
                  aInts[0] = padHex(parseInt(aInts[0], 10).toString(16));
                  aInts[1] = padHex(parseInt(aInts[2], 10).toString(16));
                  aInts[2] = padHex(parseInt(aInts[2], 10).toString(16));
                  oCurrentTestData.sActualValue = "#"+aInts[0]+aInts[1]+aInts[2];
              }
    };
    
    var testPixels = function(oCurrentTestData) {
        if(oCurrentTestData.sRule.indexOf("px") !== -1) {
            //find out how many decimal places it has
            var aDecimals = oCurrentTestData.sRule.split(".");
            var iValue = parseFloat(oCurrentTestData.sActualValue, 10);
            if(aDecimals[1]) {
                //there are decimals
                var iDecimalPlaces = aDecimals[1].replace(/px/, "").length;
                //convert result to same
                var iMultiplier = Math.pow(10, iDecimalPlaces);
                iValue = Math.round(iValue*iMultiplier)/iMultiplier;
                oCurrentTestData.sActualValue = iValue + "px";
            } else {
                //no decimals so round
                iValue = Math.round(iValue);
                oCurrentTestData.sActualValue = iValue + "px";
            }
        }
    };
    
    var padHex = function(sNumber) {
        if(sNumber.length === 1) {
            sNumber = "0"+sNumber;
        }
        return sNumber;
    };
    
    var testBold = function(oCurrentTestData) {
        replaceFontWeightKeywords(oCurrentTestData.sActualValue);
        replaceFontWeightKeywords(oCurrentTestData.sRule);
    };
    
    var replaceFontWeightKeywords = function(sValue) {
        sValue.replace(/lighter/, "399");
        sValue.replace(/normal/, "400");
        sValue.replace(/bold/, "700");
        sValue.replace(/bolder/, "401");
        
    };
    
    var arrayToString = function(array) {
        var sText = "[";
        for(var i=0; i<array.length; i++)
        {
            var sSeparator = "";
            if(i !== array.length-1) {
                sSeparator = ",";
            }
            sText += array[i]+sSeparator;
        }
        sText += "]";
        return sText;
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
    *   @function - cssUnit.testData.examplePublicMethod
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.examplePublicMethod = function()
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
    
    cssUnit.testRunner.testQueue = [];


})(cssUnit);



