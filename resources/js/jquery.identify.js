jQuery.fn.identify = function(prefix) {
	var pre = (prefix == null)?'id':prefix;
	return this.each(function(){
		var xid = null;
		if(!this.id || this.id == null) { 
			// has no ID, so generates one from jQuery reference data
			xid = pre+jQuery.data(this);
			this.id = xid;
		} else {
			xid = this.id;
		}
		return xid;
  });
};