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
   
       var sCurrentProfile = "tmpSuite";
       var sCookieName = "cssUnitData";
       var oTestData = {};
   
    /***********************************************
    // cssUnit.Template : class constructor (description)
    ***********************************************/
    cssUnit.testData = function(){
       //look for the initial cookie data
       var oCookieData = $.evalJSON($.cookie(sCookieName));
       if(oCookieData) {
           oTestData = oCookieData;
       }
       var sLastSetName = getLastSetName(oTestData);
       //if there is none create one
       if(sLastSetName === null) {
           sLastSetName = cssUnit.testData.createNewTestset();
       }
       
       sCurrentProfile = sLastSetName;
       
    };
    
    /***********************************************
    *   @function - getLastSetName
    *   @description  - This gets the last used test set name
    *   @param- void
    *   @returns - false
    ***********************************************/
    var getLastSetName = function(oTestData)
    {
        var sLastItem = null;
        for(var name in oTestData)
        {
            sLastItem = name;
        }
        return sLastItem;
    };
    
    /***********************************************
    *   @function - saveData
    *   @description  - This saves the data into a cookie
    *   @param- void
    *   @returns - false
    ***********************************************/
    var saveData = function()
    {
        var sCurrentData = $.toJSON(oTestData);
        $.cookie(sCookieName, sCurrentData);
    };
    
    /***********************************************
    *   @function - createNewTestset
    *   @description  - creates a new testset with the given name
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.createNewTestset = function(sTestSetName)
    {
        if(!sTestSetName) {
            var dCurrentTime = new Date();
            sTestSetName = ""+dCurrentTime.getFullYear()+dCurrentTime.getMonth()+dCurrentTime.getDate()+"_"+dCurrentTime.getHours()+dCurrentTime.getMinutes()+dCurrentTime.getSeconds();
        }
        sTestSetName = sTestSetName.replace(/-/, "_");
        oTestData[sTestSetName] = {
            displayName : null,
            files : [],
            selectors : {},
            iTotalRuns : 0,
            iTotalFails : 0,
            iTotalPasses : 0,
            sLastRun : null
        };
        return sTestSetName;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.examplePublicMethod
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.addSelectorData = function(sSelector, aRules)
    {
        var oSelectedSelectors = oTestData[sCurrentProfile].selectors;
        var aRefresh = null;
        if(oSelectedSelectors[sSelector]) {
            //selector already exists in tests so add the new rules
            for(var i=0; i<aRules.length; i++)
            {
                var sRuleName = aRules[i].name.replace(/-/, "_");
                if(oSelectedSelectors[sSelector][sRuleName]) {
                    oSelectedSelectors[sSelector][sRuleName] = oSelectedSelectors[sSelector][sRuleName].concat(aRules[i].values);
                } else {
                     oSelectedSelectors[sSelector][sRuleName] = aRules[i].values;
                }
            }
            oSelectedSelectors[sSelector][sRuleName] = $.richArray.unique(oSelectedSelectors[sSelector][sRuleName]);
            aRefresh = oSelectedSelectors[sSelector];
            
        } else {
            //selector does not already exist so create it and add the values
             oSelectedSelectors[sSelector] = {};
             for(var j=0; j<aRules.length; j++)
             {
                var sRuleName = aRules[j].name.replace(/-/, "_");
                oSelectedSelectors[sSelector][sRuleName] = aRules[j].values;
             }
        }
        
        saveData();
        return aRefresh;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.examplePublicMethod
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.getSelectorData = function()
    {
        var oSelectedSelectors = oTestData[sCurrentProfile].selectors;
        return oSelectedSelectors;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.getTestSetNames
    *   @description  - This gets the names of all available test sets
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.getTestProfileNames = function()
    {
        var aTestSetNames = [];
        for(var name in oTestData)
        {
            aTestSetNames.push({
                id: name,
                displayName: oTestData[name].displayName
            });
        }
        return aTestSetNames;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.getTestProfileName
    *   @description  - This gets the id of the currently selected profile
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.getTestProfileName = function()
    {
        return sCurrentProfile;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.getTestProfileDisplayName
    *   @description  - This gets the display name of currently selected profile
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.getTestProfileDisplayName = function()
    {
        var sDisplayName = oTestData[sCurrentProfile].displayName;
        if(sDisplayName === null)
        {
            sDisplayName = sCurrentProfile;
        }
        return sDisplayName;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.removeSelector
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.removeSelector = function(sSelectorName)
    {
        var oSelectedSelectors = oTestData[sCurrentProfile].selectors;
        if(oSelectedSelectors[sSelectorName]) {
            delete oSelectedSelectors[sSelectorName];
        }
        saveData();
    };
    
    /***********************************************
    *   @function - cssUnit.testData.addFile
    *   @description  - This is adds a file to the test set and saves it
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.addFile = function(sFileName)
    {
        var oSelectedFiles = oTestData[sCurrentProfile].files;
        if(oSelectedFiles) {
            var iInitalSize = oSelectedFiles.length;
            oSelectedFiles.push(sFileName);
            oTestData[sCurrentProfile].files = $.richArray.unique(oSelectedFiles);
            saveData();
            if(oTestData[sCurrentProfile].files.length === iInitalSize) {
                return false;
            } else {
                return true;
            }
        }
    };
    
    /***********************************************
    *   @function - cssUnit.testData.getFiles
    *   @description  - Gets the fileset for this testset
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.getFiles = function()
    {
        return oTestData[sCurrentProfile].files.slice();
    };
    
    /***********************************************
    *   @function - cssUnit.testData.removeFile
    *   @description  - removes a file from the testset
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.removeFile = function(sFileName)
    {
        oTestData[sCurrentProfile].files = $.richArray.without(oTestData[sCurrentProfile].files, sFileName);
        saveData();
    };
    
    /***********************************************
    *   @function - cssUnit.testData.setCurrentTestset
    *   @description  - sets the testset
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.setCurrentTestset = function(sTestSetName)
    {
        var bExists = false;
        for(var name in oTestData)
        {
            if(name === sTestSetName) {
                bExists = true;
            };
        }
        if(bExists) {
            sCurrentProfile = sTestSetName;
        }
        
    };
    
    /***********************************************
    *   @function - cssUnit.testData.updateDisplayName
    *   @description  - removes a file from the testset
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.updateDisplayName = function(sNewName)
    {
        oTestData[sCurrentProfile].displayName = sNewName;
        saveData();
    };
    /***********************************************
    *   @function - cssUnit.testData.export
    *   @description  - removes a file from the testset
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.exportData = function()
    {
        return oTestData;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.registerPass
    *   @description  - registers a passed test
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.registerPass = function()
    {
        oTestData[sCurrentProfile].iTotalPasses++;
        oTestData[sCurrentProfile].iTotalRuns++;
        updateLastRun();
        saveData();
        return false;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.registerFail
    *   @description  - registers a passed test
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.registerFail = function()
    {
        oTestData[sCurrentProfile].iTotalFails++;
        oTestData[sCurrentProfile].iTotalRuns++;
        updateLastRun();
        saveData();
        return false;
    };
    
    /***********************************************
    *   @function - updateLastRun
    *   @description  - updates the last run data
    *   @param- void
    *   @returns - false
    ***********************************************/
    var updateLastRun = function()
    {
        var dCurrentTime = new Date();
        sPrettyDate = dCurrentTime.getDate()+"/"+dCurrentTime.getMonth()+"/"+dCurrentTime.getFullYear()+" "+dCurrentTime.getHours()+":"+dCurrentTime.getMinutes();
        oTestData[sCurrentProfile].sLastRun = sPrettyDate;
        return false;
    };
    
    /***********************************************
    *   @function - cssUnit.testData.getHistory
    *   @description  - registers a passed test
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.testData.getHistory = function()
    {
        var oHistory = {
            iTotalFails : oTestData[sCurrentProfile].iTotalFails,
            iTotalPasses : oTestData[sCurrentProfile].iTotalPasses,
            iTotalRuns : oTestData[sCurrentProfile].iTotalRuns,
            sLastRun : oTestData[sCurrentProfile].sLastRun
            
        };
        return oHistory;
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

    /***********************************************
    // Define the notional plugin constants
    ***********************************************/
    cssUnit.testData.constants = {};

    /***********************************************
    // Define the plugin cache
    ***********************************************/
    cssUnit.testData.cache = {};

})(cssUnit);



