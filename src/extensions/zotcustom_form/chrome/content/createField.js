/*
	Item Pane file with Custom Fields extension modifications.
*/

// Console Tool; Remove after done:
Components.utils.import("resource://gre/modules/devtools/Console.jsm");

var createField = new function() {
	
	this.add = function () {
		console.log("derp");
		var tree = document.getElementById("tree");
		var io = {singleSelection:true};
		window.openDialog('chrome://zotero/content/selectItemsDialog.xul', '', 'chrome,modal', io);
		var selectedItemID = io.dataOut[0];
		var selectedItem = Zotero.Items.get(selectedItemID);
		var newfield = document.getElementById(new_field);
		selectedItem.setField(newfield,"");
	};
	
}