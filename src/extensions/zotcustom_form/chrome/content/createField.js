/*
	Item Pane file with Custom Fields extension modifications.
*/

// Console Tool; Remove after done:
Components.utils.import("resource://gre/modules/devtools/Console.jsm");
Zotero.CustomForms = {
        DB: null,
        values: null,
        init: function() { 
                window.console.log("running init");
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
            Zotero.CustomForms.init();
        	var selectedItem = window.arguments[0];
            var textbox = document.getElementById('new_field');
            var field_value = document.getElementById('new_field_value');
            console.log(field_value.value);
            // get rid of blank spaces
            var field = textbox.value.replace(/\s+/g, '');
            // get next id available
            var old_fieldID = Zotero.DB.query("SELECT COUNT(*) FROM customFields WHERE fieldName = '" + field.toLowerCase() + "';");
            console.log(Zotero.DB.query('SELECT * FROM customFields'));
            console.log(old_fieldID);
            console.log(old_fieldID[0]);
            console.log(old_fieldID[0]['COUNT(*)'] == 0);
            console.log(old_fieldID[0]['COUNT(*)'] === 0);
            var fieldID;             
            if (old_fieldID[0]['COUNT(*)'] === 0){
                fieldID = Zotero.ID.get('customFields');
                Zotero.DB.query("INSERT INTO customFields VALUES (?, ?, ?)", [fieldID,field.toLowerCase(),textbox.value]);
                Zotero.Schema.updateCustomTables();
            }
            // get the id of our field after merge
            console.log(Zotero.DB.query('SELECT * FROM fieldsCombined'));
            console.log("'" + field.toLowerCase() + "'");
            var fieldscombined_item  = Zotero.DB.query("SELECT fieldID FROM fieldsCombined WHERE fieldName = '" + field.toLowerCase() + "'");
            console.log(fieldscombined_item);
            var fieldId_fieldscombined = fieldscombined_item[0].fieldID;
            if (!(this.DB.query("SELECT value FROM customfieldsvalues WHERE itemID =" + selectedItem[0].getID() + " AND fieldID = " + fieldId_fieldscombined))){
                selectedItem[0]._itemData[fieldId_fieldscombined] = field_value.value;
                //insert it into our own database
                console.log(selectedItem);
                this.DB.query("INSERT INTO customfieldsvalues VALUES (?, ?, ?)", [selectedItem[0].getID(), fieldId_fieldscombined, field_value.value]);
                selectedItem[2].viewItem(selectedItem[0], 'edit', 0);
             }
            else{
                window.alert("One item cannot have a name witht the same field name, please enter another field name e.g. field_name2");
            }
        },

};