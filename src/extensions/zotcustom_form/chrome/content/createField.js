/*
	Item Pane file with Custom Fields extension modifications.
*/

// Console Tool; Remove after done:
Components.utils.import("resource://gre/modules/devtools/Console.jsm");

var createField = new function() {
	this.add = function () {
		var selectedItem = window.arguments[0];
        var textbox = document.getElementById('new_field');
        var nextFieldID = Zotero.DB.getNextID("fieldsCombined","fieldID");
        var sql = "INSERT INTO fieldsCombined VALUES (" + nextFieldID + "," + "'" + textbox.value + "',NULL, NULL,1);";
        Zotero.DB.query(sql);
        selectedItem[0]._itemData[nextFieldID] = "";
        selectedItem[1].childElementCount++;
        console.log(Zotero.DB.query("SELECT * FROM fieldsCombined;"));
        console.log(textbox.value);
        console.log(selectedItem);
	};
}