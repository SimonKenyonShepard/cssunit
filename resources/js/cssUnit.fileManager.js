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
       var sInputRef = "#newFile";
       var sFormRef = "#addFiles";
   
    /***********************************************
    // cssUnit.Template : class constructor (description)
    ***********************************************/
    cssUnit.fileManager = function(){
       //bind the form submit to the add selector
       $(sFormRef).bind("submit", newFile);
    };
    
    /***********************************************
    *   @function - newFile
    *   @description  - This generates a new file
    *   @param- void
    *   @returns - false
    ***********************************************/
    var newFile = function(event)
    {
        event.preventDefault();
        var sFileName = $(sInputRef).attr("value");
        var bNewFile = cssUnit.testData.addFile(sFileName);
        if(bNewFile) {
            var eNewFile = generateNewFileMarkUp(sFileName);
            $(eNewFile).hide();
            $("#existingFiles").prepend(eNewFile);
            $(eNewFile).slideDown("normal");            
        }
    };
    
    /***********************************************
    *   @function - generateNewFileMarkUp
    *   @description  - This generates a new file
    *   @param- void
    *   @returns - false
    ***********************************************/
    var generateNewFileMarkUp = function(sFileName)
    {
		var sDisplayFileName = sFileName;
		if(sFileName.length > 17) {
			sDisplayFileName = "..."+sDisplayFileName.substr(sFileName.length-15, sFileName.length); 
		}
        var eNewFile = $('<div class="fileName"><span title="'+sFileName+'">'+sDisplayFileName+'</span><span class="remove">remove</span></div>');
        $(".remove", eNewFile).bind("click", {sFileName : sFileName}, removeFile);
        return eNewFile;
    };
    
    /***********************************************
    *   @function - cssUnit.fileManager.updateFiles
    *   @description  - This generates a new file
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.fileManager.updateFiles = function()
    {
        $("#existingFiles").empty();
        var aFiles = cssUnit.testData.getFiles();
        for(var i = 0; i<aFiles.length; i++)
        {
            var eNewFile = generateNewFileMarkUp(aFiles[i]);
            $("#existingFiles").prepend(eNewFile);
        }
    };
    
    /***********************************************
    *   @function - removeFile
    *   @description  - This removes the current file
    *   @param- void
    *   @returns - false
    ***********************************************/
    var removeFile = function(event)
    {
       cssUnit.testData.removeFile(event.data.sFileName);
       $(this).parent().slideUp("normal", function(){$(this).remove();})
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
    *   @function - cssUnit.fileManager.examplePublicMethod
    *   @description  - This is an example public method for the plugin
    *   @param- void
    *   @returns - false
    ***********************************************/
    cssUnit.fileManager.examplePublicMethod = function()
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
    cssUnit.fileManager.constants = {};

    /***********************************************
    // Define the plugin cache
    ***********************************************/
    cssUnit.fileManager.cache = {};

})(cssUnit);



