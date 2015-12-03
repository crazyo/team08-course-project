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
            Zotero.CustomForms.init();
        	var selectedItem = window.arguments[0];
            var textbox = document.getElementById('new_field');
            var field_value = document.getElementById('new_field_value');
            // get rid of blank spaces
            var field = textbox.value.replace(/\s+/g, '');
            // get next id available
            var old_fieldID = Zotero.DB.query("SELECT COUNT(*) FROM customFields WHERE fieldName = '" + field.toLowerCase() + "';");
            var fieldID;             
            if (old_fieldID[0]['COUNT(*)'] === 0){
                fieldID = Zotero.ID.get('customFields');
                Zotero.DB.query("INSERT INTO customFields VALUES (?, ?, ?)", [fieldID,field.toLowerCase(),textbox.value]);
                Zotero.Schema.updateCustomTables();
            }
            // get the id of our field after merge
            var fieldscombined_item  = Zotero.DB.query("SELECT fieldID FROM fieldsCombined WHERE fieldName = '" + field.toLowerCase() + "' AND custom = 1");
            var fieldId_fieldscombined = fieldscombined_item[0].fieldID;
            if (!(this.DB.query("SELECT value FROM customfieldsvalues WHERE itemID =" + selectedItem[0].getID() + " AND fieldID = " + fieldId_fieldscombined))){
                selectedItem[0]._itemData[fieldId_fieldscombined] = field_value.value;
                //insert it into our own database
                this.DB.query("INSERT INTO customfieldsvalues VALUES (?, ?, ?)", [selectedItem[0].getID(), fieldId_fieldscombined, field_value.value]);
                selectedItem[2].viewItem(selectedItem[0], 'edit', 0);
             }
            else{
                window.alert("One item cannot have two custom fields with the same name, please enter another field name e.g. field_name2");
            }
        },
        removeField:function() {
            Zotero.CustomForms.init();
            var selectedItem = window.arguments[0];
            var itemID = selectedItem[0].getID();
            var dialogbox = document.getElementById("zotcustom_remove");
            vbox = dialogbox.childNodes[3];
            if(vbox.childNodes[0].getAttribute('type') === 'checkbox'){
                for (i = 0; i< vbox.childNodes.length;i++){
                    if(vbox.childNodes[i].getAttribute('checked') === 'true'){
                        var label = vbox.childNodes[i].getAttribute('label');
                        var fieldID = Zotero.DB.query("SELECT fieldID FROM fieldsCombined WHERE label = '" +  label + "' AND custom=1");
                        Zotero.CustomForms.DB.query("DELETE FROM customfieldsvalues WHERE itemID = " + itemID + " AND fieldID = " + fieldID[0].fieldID);
                    }
                }
            }
        },

        addCheckbox:function(){
            var dialogbox = document.getElementById("zotcustom_remove");
            var vbox = document.createElement("vbox");
            vbox.setAttribute("flex","1");
            var selectedItem = window.arguments[0];
            Zotero.CustomForms.init();
            var customfields = Zotero.CustomForms.DB.query("SELECT fieldID,value FROM customfieldsvalues WHERE itemID =? ",selectedItem[0].getID());
            if (customfields){
                for each(var current in customfields){
                    var fieldnameandlabel = Zotero.DB.query("SELECT label FROM fieldsCombined WHERE fieldID =" + current.fieldID + " AND custom=1");
                    var checkbox = document.createElement("checkbox");
                    checkbox.setAttribute("label", fieldnameandlabel[0].label);
                    checkbox.setAttribute('checked','false');
                    checkbox.setAttribute('type','checkbox');
                    vbox.appendChild(checkbox);
                }
            }
            else
            {   
                var label = document.createElement("label");
                label.setAttribute("value", "The current item has no custom fields to remove");
                label.setAttribute('type','label');
                vbox.appendChild(label);
            }
            dialogbox.appendChild(vbox);
        },
};