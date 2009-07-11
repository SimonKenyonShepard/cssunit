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
   
    
   
    /***********************************************
    // cssUnit.testRunner : class constructor (description)
    ***********************************************/
    cssUnit.testProfile = function(){
       //create the main drop down and populate the name field
       updateDropDown();
       $("#newTestSet").bind("click", createNewTestSet);
       $("#testSet").bind("change", changeTestSet);
       $(".rename").bind("submit", updateDisplayName);
       $("#testSetName").bind("focus", function() {$(this).select();});
       $("#testSet").trigger("change");
    };
    
    /***********************************************
    *   @function - updateDropDown
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var updateDropDown = function()
    {
        //get the names of the testSets
        var aNames = cssUnit.testData.getTestProfileNames();
        var sCurrentTestSuit = cssUnit.testData.getTestProfileName();
        var sDropDown = '<select id="testSet">';
        for(var i=0; i<aNames.length; i++) {
            var sSelected = "";
            var sDisplayName = aNames[i].displayName;
            if(sCurrentTestSuit === aNames[i].id) {
                sSelected = ' selected="true" ';
            }
            
            if(sDisplayName === null) {
                sDisplayName = aNames[i].id;
            }
            sDropDown += "<option"+sSelected+' value="'+aNames[i].id+'">'+sDisplayName+"</option>";
        }
        sDropDown +="</select>";
        $("#testSet").replaceWith(sDropDown);
    };
    
    /***********************************************
    *   @function - createNewTestSet
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var createNewTestSet = function()
    {
        var sNewSetName = cssUnit.testData.createNewTestset();
        cssUnit.testData.setCurrentTestset(sNewSetName);
        updateDropDown();
        cssUnit.selectors.updateSelectors();
        cssUnit.fileManager.updateFiles();
    };
    
    /***********************************************
    *   @function - changeTestSet
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var changeTestSet = function()
    {
        var sSelected = $(this).attr("value");
        cssUnit.testData.setCurrentTestset(sSelected);
        cssUnit.selectors.updateSelectors();
        cssUnit.fileManager.updateFiles();
        getDisplayName();
        updateSummaryData();
    };
    /***********************************************
    *   @function - getDisplayName
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var getDisplayName = function()
    {
        
        var sDisplayName = cssUnit.testData.getTestProfileDisplayName();
       $("#testSetName").attr("value", sDisplayName);
        
    };
    /***********************************************
    *   @function - updateDisplayName
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var updateDisplayName = function(event)
    {
        event.preventDefault();
        var oNewName = $("input", this);
        cssUnit.testData.updateDisplayName(oNewName.attr("value"));
        updateDropDown();
        $(oNewName).blur();
    };
    
    /***********************************************
    *   @function - updateSummaryData
    *   @description  - This updates the data in the profile display with latest summary
    *   @param- void
    *   @returns - false
    ***********************************************/
    var updateSummaryData = function()
    {
        var oHistory = cssUnit.testData.getHistory();
        $("#totalRuns").empty().text(oHistory.iTotalRuns);
        $("#lastRun").empty().text(oHistory.sLastRun);
        //$("#fails .bar").animate({backgroundPositionX : 0}, 3000, 'easeInOutQuad');
        //$("#passes .bar").animate({backgroundPositionX : -140}, 3000, 'easeInOutQuad');
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


})(cssUnit);



