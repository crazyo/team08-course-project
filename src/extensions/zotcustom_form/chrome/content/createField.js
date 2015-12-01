/*
	Item Pane file with Custom Fields extension modifications.
*/

// Console Tool; Remove after done:
Components.utils.import("resource://gre/modules/devtools/Console.jsm");
Zotero.CustomForms = {
        DB: null,
        values: null,

        init: function() { 
                this.DB = new Zotero.DBConnection("CustomForms");
                if (!this.DB.tableExists("customfieldsvalues")) {
                    this.DB.query("CREATE TABLE customfieldsvalues (itemID INT,fieldID INT, value TEXT);");
                }
                var sql = "SELECT * FROM customfieldsvalues;";
                //load custom fields into items
                var values = this.DB.query(sql);
                var currItem = [];
                for (currItem in this.values)
                    {
                        try {
                                Zotero.item.getElementById(currItem[0])._itemData[currItem[1]] = currItem[2];
                         }
                         catch(err) {
                                        }
                    }
        },
        createField:function() {
        	var selectedItem = window.arguments[0];
            var textbox = document.getElementById('new_field');
            // get rid of blank spaces
            var field = textbox.value.replace(/\s+/g, '');
            // get next id available
            var fieldID = Zotero.ID.get('customFields');
            Zotero.DB.query("INSERT INTO customFields VALUES (?, ?, ?)", [fieldID, field.toLowerCase(), textbox.value]);
            Zotero.Schema.updateCustomTables();
            // get the id of our field after merge
            var fieldscombined_item = Zotero.DB.query('SELECT fieldID FROM fieldsCombined WHERE fieldName = (?)',[field.toLowerCase()]);
            var fieldId_fieldscombined = fieldscombined_item[0].fieldID;
            var def = 'default';
            selectedItem[0]._itemData[fieldId_fieldscombined] = def;
            //insert it into our own database
            console.log(selectedItem);
            this.DB.query("INSERT INTO customfieldsvalues VALUES (?, ?, ?)", [selectedItem[0].getID(), fieldId_fieldscombined, def]);
            selectedItem[2].viewItem(selectedItem[0], 'edit', 0);
        },

};