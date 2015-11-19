var SaveCustom = new function() {
	
    var styleList = window.arguments[0];
	var output = window.arguments[1];
	
	this.save = function() {
		var saveName = document.getElementById("save-citation-textbox");
		styleList.appendItem(saveName.value);
	}
}