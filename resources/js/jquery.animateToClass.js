/*
 * jQuery Animate To Class
 * Copyright 2008 Igor Frias Vieira
 * http://igorvieira.com/blog/animate-to-class/
 *
 * Released under the MIT and GPL licenses.
 */

(function($)
{
	$.fn.extend({
		animateToClass : function(to, duration, easing, callback)
		{
			if(!to){ return this; }
			var sClassName = to.replace(/\./g, "");
			var oNewStyles = selectStyle(to);
			var id = null;
			if($(this).get(0)) {
				id = $(this).get(0).id;
			}
			if(!this.hasClass(sClassName))
			{
				var fNewCallback = function() {
					$(this).addClass(sClassName);
					if(callback){
						callback();	
					}
				};
				/* add the currect styles to the cache */
				addStylesToCache(objStyle, this);
				/* animate to the class */
				return this.animate(oNewStyles, duration, easing, fNewCallback);	
			} else if(jQuery.fn.animateToClass.cache[id]) {
				/* get the cached old styles an animate back */
				var fNewCallback = function() {
					$(this).removeClass(sClassName);
					if(callback){
						callback();	
					}
				};
				/* re-animate to the class */
				return this.animate(jQuery.fn.animateToClass.cache[id], duration, easing, fNewCallback);	
				
			}
			
		}
	});
	
	function selectStyle(sel)
	{
		$(document.styleSheets).each(function(i,v){
			if($.browser.msie)
			{
				if(v.rules.length > 0)
				{
					$(v.rules).each(function(i2,v2){
						if(sel == v2.selectorText)
						{
							attrClass = v2.style.cssText;
						}
					});
				}
				else if(v.imports.length > 0)
				{
					$(v.imports).each(function(i2,v2){
						if(sel == v2.selectorText)
						{
							attrClass = v2.style.cssText;
						}
					});
				}
			}
			else
			{
				$(v.cssRules).each(function(i2,v2){
					if(sel == v2.selectorText)
					{
						attrClass = v2.style.cssText;
					}
				});
			}
		});
		
		objStyle = {};
		/* break up each of the rules */
		attrClass = attrClass.split(";");
		$(attrClass).each(function(i,v){
			
			if(v !== ""){
				v = v.split(":");
				v[0] = toCamelCase(v[0]);
				objStyle[v[0]] = $.trim(v[1]);
			}
		});
		return objStyle;
	}
	
	function addStylesToCache(objStyle, eAnimationSubjects){
		
		jQuery(eAnimationSubjects).each(function() {
			$(this).identify();
			var id = $(this).get(0).id;
			var oStyleCache = {};
		
			for(var styleName in objStyle)
			{
				if (styleName) {
					var sValue = jQuery(this).css(styleName);
					if (sValue === "") {
						sValue = "0";
					}
					oStyleCache[styleName] = sValue;
				}
			}
			jQuery.fn.animateToClass.cache[id] = oStyleCache;
		});
	}
	
	function toCamelCase(str)
	{
		str = str.replace(/\s/g, "");

		str = str.replace(/-/g, " ");
		
		str = str.toLowerCase();
		strArr = str.split(" ");
		
		var nStr = "";
		$(strArr).each(function(i,v){
			if(i === 0){
				nStr += v;
			}else{			
				nStr += v.substr(0,1).toUpperCase()+v.substr(1,v.length);
			}
		});
		return nStr;
	}
	
	jQuery.fn.animateToClass.cache = {};
})(jQuery);