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
       var sInputRef = "#newRule";
       var sFormRef = "#addRules";
       var sCurrentClass = ".current";
       var iListInitalSize = 0;
   
    /***********************************************
    // cssUnit.Template : class constructor (description)
    ***********************************************/
    cssUnit.selectors = function(){
       //bind the form submit to the add selector
       $(sFormRef).bind("submit", newSelectorRule);
    };
    
    /***********************************************
    *   @function - newSelectorRule
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var newSelectorRule = function(event)
    {
        event.preventDefault();
        var sNewRule = $(sInputRef).attr("value").split("{");
        var sSelector = $.trim(sNewRule[0].toLowerCase());
        var aRuleData = $.trim(sNewRule[1].toLowerCase()).replace(/}/, "").replace(/;/g, "").split(":");
        var sRuleName = aRuleData[0];
        var sRuleValue = aRuleData[1].replace(/ /g, "");
        
        var aNewRules = cssUnit.testData.addSelectorData(sSelector, [{name : sRuleName, values : [sRuleValue]}]);
        var eSelector = null;
        if(aNewRules !== null) {
            //remove the existing contents and update with new
            eSelector = $("#existingRules").find(".selector_"+sSelector);
            //create the new contents
            var eSelectorContents = generateSelectorContents(sSelector, aNewRules);
            $(eSelectorContents).css({opacity: 0});
            
            eSelector.children().animate({opacity : 0}, 100);
            eSelectorContents.delay(function() {
                eSelector.empty();
                eSelector.append(eSelectorContents);
                $(eSelectorContents).animate({opacity: 1});
                 
            }, 150);
            
        } else {
            //create a new block and add it to the list
            var oRules = {};
            oRules[sRuleName] = [sRuleValue];
            eSelector = generateNewSelector(sSelector, oRules);
            $(eSelector).css({overflow: "hidden", height: 0, opacity: 0});
            $("#existingRules").prepend(eSelector);
        }
        //figure out how big it is and resize
        eSelector.delay(function() {
            //var iHeight = $(eSelector).get(0).scrollHeight;
            var iHeight = 0;
            $(eSelector).children().each(function(){
                iHeight += $(this).outerHeight();
            });
            iHeight = iHeight-10;
            $(eSelector).animate({height: iHeight, opacity: 1}, 300, null, function() {$(this).css({opacity: 0.999});});
        }, 200);
        
    };
    
    /***********************************************
    *   @function - generateSelectorWrapper
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var generateNewSelector = function(sSelectorName, aRules)
    {
        var iRules = 0;
        var eNewSelector = $('<div class="selectorRules selector_'+sSelectorName+'"></div>');
        $(eNewSelector).bind("click",{sSelectorName : sSelectorName}, ruleActions);
        var eNewSelectorContents = generateSelectorContents(sSelectorName, aRules);
        eNewSelector.append(eNewSelectorContents);
        
        return eNewSelector;
    };
    
    /***********************************************
    *   @function - generateSelectorWrapper
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var generateSelectorContents = function(sSelectorName, aRules)
    {
        var iRules = 0;
        var sNewSelectorContents = "";
        //insert rules
        for(var name in aRules) {
            sNewSelectorContents += generateRule(name, aRules[name]);
            iRules += aRules[name].length;
        }
        //create the title
        sNewSelectorContents = '<span class="ruleSelector">'+sSelectorName+" {"+iRules+' rules}</span><span class="remove">remove</span>' + sNewSelectorContents;
        
        return $(sNewSelectorContents);
    };
    
    /***********************************************
    *   @function - generateSelector
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    var generateRule = function(sRuleName, aRuleValues)
    {
        
        sRuleName = sRuleName.replace(/_/, "-");
        var sRuleText = '<span class="rule">'+sRuleName+": ";
        for(var i=0; i<aRuleValues.length; i++) {
            sRuleText += aRuleValues[i]+ "; ";
        }
        sRuleText += "</span>";
        return sRuleText;
    };
    
    /***********************************************
    *   @function - ruleActions
    *   @description  - This delegates a rule click to it's function
    *   @param- void
    *   @returns - false
    ***********************************************/
    var ruleActions = function(event)
    {
        if($(event.target).hasClass("remove")) {
            var sSelectorName = event.data.sSelectorName;
            cssUnit.testData.removeSelector(sSelectorName);
            $(event.target).parent().animate({opacity: 0, height: 0}, 300, null, function() {$(this).remove();});
        }
    };
    
    /***********************************************
    *   @function - update selectors
    *   @description  - This updates the display of selectors with what's in the current
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.selectors.updateSelectors = function()
    {
        $("#existingRules").empty();
        var sCurrentName = cssUnit.testData.getTestProfileNames();
        if(sCurrentName) {
            var oSelectorData = cssUnit.testData.getSelectorData();
            for(var name in oSelectorData)
            {
                var eSelector = generateNewSelector(name, oSelectorData[name]);
                $("#existingRules").prepend(eSelector);
            }
        }
        
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
    *   @function - cssUnit.selectors.examplePublicMethod
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.selectors.examplePublicMethod = function()
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
    cssUnit.selectors.constants = {};

    /***********************************************
    // Define the plugin cache
    ***********************************************/
    cssUnit.selectors.cache = {};

})(cssUnit);



