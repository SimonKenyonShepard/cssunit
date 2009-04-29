jQuery.extend({
    curCSS: function( elem, name, force ) {
		var ret, style = elem.style;

		// We need to handle opacity special in IE
		if ( name == "opacity" && !jQuery.support.opacity ) {
			ret = jQuery.attr( style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float value
		if ( name.match( /float/i ) )
        {
            name = styleFloat;
        }
        
		if ( !force && style && style[ name ] )
        {
            ret = style[ name ];
        } else if ( window.getComputedStyle ) {

			// Only "float" is needed here
			if ( name.match( /float/i ) )
            {
                name = "float";
            }
				

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle( elem, null );

			if ( computedStyle )
            {
                ret = computedStyle.getPropertyValue( name );
            }
				

			// We should always get a number back from opacity
			if ( name == "opacity" && ret == "" )
            {
                ret = "1";
            }
				

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	}
});
    


