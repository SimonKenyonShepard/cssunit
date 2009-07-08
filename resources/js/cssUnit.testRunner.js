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
    
    cssUnit.getTestHarness = function() {
        return eTestHarness;
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
                  
                  normalizeColors(oCurrentTestData);
                  
                  normalizePixels(oCurrentTestData);
                  
                  normalizeFontWeight(oCurrentTestData);
                  
                  checkForDivision(oCurrentTestData);
                  //check to to see if it
                  if(oCurrentTestData.sActualValue === oCurrentTestData.sRule) {
                      bPassed = true;
                  }
              }
              oTestData.aTested.push( {
                  iElementIndex : iIndex,
                  sExpected : sRules,
                  sActual : oCurrentTestData.sActualValue,
                  bPassed : bPassed 
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
            eNewEntry.bind("click", oTestData, cssUnit.displayTestResults);
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
            break;
        }
        $("#console").animate({backgroundColor: sBGColor});
    };
    
    var normalizeColors = function(oCurrentTestData) {
        //for different browsers return different styles of color response
        if(oCurrentTestData.sActualValue.indexOf("rgb") !== -1)
              {
                  oCurrentTestData.sActualValue = oCurrentTestData.sActualValue.replace(/([A-Za-z\(\) ])/g, "");
                  var aInts = oCurrentTestData.sActualValue.split(",");
                  aInts[0] = padHex(parseInt(aInts[0], 10).toString(16));
                  aInts[1] = padHex(parseInt(aInts[2], 10).toString(16));
                  aInts[2] = padHex(parseInt(aInts[2], 10).toString(16));
                  oCurrentTestData.sActualValue = ("#"+aInts[0]+aInts[1]+aInts[2]).toUpperCase();
              }
    };
    
    var normalizePixels = function(oCurrentTestData) {
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
    
    var normalizeFontWeight = function(oCurrentTestData) {
        oCurrentTestData.sActualValue= replaceFontWeightKeywords(oCurrentTestData.sActualValue);
        oCurrentTestData.sRule = replaceFontWeightKeywords(oCurrentTestData.sRule);
    };
    
    var replaceFontWeightKeywords = function(sValue) {
        return sValue.replace(/bold/, "700");
    };
    
    var checkForDivision = function(oCurrentTestData) {
        if(oCurrentTestData.sRule.indexOf("/") !== -1) {
            var divisor = parseFloat(oCurrentTestData.sRule.replace(/\//, ""), 10);
            var remainder = parseFloat(oCurrentTestData.sActualValue, 10)%divisor;
            if(remainder === 0) {
                oCurrentTestData.sRule = oCurrentTestData.sActualValue;
            }
        }
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
    
    var shorten = function(sText, iLength) {
        return sText.substring(0, iLength-3)+"...";
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



