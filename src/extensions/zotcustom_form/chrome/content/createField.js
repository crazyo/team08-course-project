/*
	Item Pane file with Custom Fields extension modifications.
*/

// Console Tool; Remove after done:
Components.utils.import("resource://gre/modules/devtools/Console.jsm");

var createField = new function() {
	this.add = function () {
	var selectedItem = window.arguments[0];
        var textbox = document.getElementById('new_field');
        var field = textbox.value.replace(/\s+/g, '');
        //var nextFieldID = Zotero.DB.getNextID("fieldsCombined","fieldID");
        //Zotero.DB.query("INSERT INTO fieldsCombined VALUES (?, ?, ?, ?, ?)",[nextFieldID,textbox.value,null, null,1]);
        var fieldID = Zotero.ID.get('customFields');
        Zotero.DB.query("INSERT INTO customFields VALUES (?, ?, ?)", [fieldID, field.toLowerCase(), textbox.value]);
        Zotero.Schema.updateCustomTables();
        var fieldscombined_item = Zotero.DB.query('SELECT fieldID FROM fieldsCombined WHERE fieldName = (?)',[field.toLowerCase()])
        var fieldId_fieldscombined = fieldscombined_item[0].fieldID;
        console.log(fieldId_fieldscombined);
        selectedItem[0]._itemData[fieldId_fieldscombined] = "";
        selectedItem[1].ref = selectedItem[0];
        selectedItem[2].viewItem(selectedItem[0], 'edit',0);

        var rows = selectedItem[1]._dynamicFields;
        var new_row = document.createElement("row");
        var label = document.createElement("label");
        label.setAttribute("fieldname", "test");
        label.setAttribute("value", "Test: ");
        new_row.appendChild(label);
        rows.appendChild(new_row);

        console.log(Zotero.DB.query("SELECT * FROM customFields;"));
        console.log(field);
        console.log(selectedItem);
        console.log(Zotero.DB.query('SELECT * FROM fieldsCombined'));
        //Zotero.ItemFields._loadFields();
	};
}
