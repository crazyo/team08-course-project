/*
	Item Pane file with Custom Fields extension modifications.
*/

// Console Tool; Remove after done:
Components.utils.import("resource://gre/modules/devtools/Console.jsm");

var ZoteroItemPane = new function() {
	this.onLoad = onLoad;
	
	var _lastItem, _itemBox, _notesLabel, _notesButton, _notesList, _tagsBox, _relatedBox;
	
	function onLoad()
	{
		if (!Zotero || !Zotero.initialized) {
			return;
		}
		
		// Extension addition:
		// Delete original tabpanels and items in item menu, in order to allow the
		// insertion of custom elements inside existing tabpanels (which had no IDs).
		var element = document.getElementById("zotero-view-item");
		var panelList = [];
		while(element.hasChildNodes()) {
			panelList.push(element.firstChild);
			element.removeChild(element.firstChild);
		}
		
		// Re-insert deleted items, except with the add button in the Items panel
		panelList.shift();
		createTabpanel(panelList);
		
		// Not in item pane, so skip the introductions
		if (!document.getElementById('zotero-view-tabbox')) {
			return;
		}
		
		_itemBox = document.getElementById('zotero-editpane-item-box');
		_notesLabel = document.getElementById('zotero-editpane-notes-label');
		_notesButton = document.getElementById('zotero-editpane-notes-add');
		_notesList = document.getElementById('zotero-editpane-dynamic-notes');
		_tagsBox = document.getElementById('zotero-editpane-tags');
		_relatedBox = document.getElementById('zotero-editpane-related');
		
	}
	
	// Extension addition: Creates tab items with extra add button inserted
	function createTabpanel(panelList)
	{	
		var tabPanels = document.getElementById("zotero-view-item");
		
		// Recreate Info tab items
		var tabPanel = document.createElement("tabpanel");
		var vbox = document.createElement("vbox");
		var hbox = document.createElement("hbox");
		var label = document.createElement("label");
		var button = document.createElement("button");
		var itemBox = document.createElement("zoteroitembox");
		
		vbox.setAttribute("flex", 1);
		vbox.setAttribute("class", "zotero-box");
		hbox.setAttribute("align", "center");
		label.setAttribute("value", "Fields:");
		button.setAttribute("id", "add_field");
		button.setAttribute("label", "Add");
		button.setAttribute("oncommand", "ZoteroItemPane.openDialog();");
		itemBox.setAttribute("id", "zotero-editpane-item-box");
		itemBox.setAttribute("flex", 1);
		
		hbox.appendChild(label);
		hbox.appendChild(button);
		vbox.appendChild(hbox);
		vbox.appendChild(itemBox);
		tabPanel.appendChild(vbox);
		tabPanels.appendChild(tabPanel);
		
		// Recreate other tab items
		var i;
		for (i = 0; i < panelList.length; ++i) {
			tabPanels.appendChild(panelList[i]);
		}
	}
	
	
	/*
	 * Load a top-level item
	 */
	this.viewItem = function (item, mode, index) {
		if (!index) {
			index = 0;
		}
		
		Zotero.debug('Viewing item in pane ' + index);
		
		switch (index) {
			case 0:
				var box = _itemBox;
				break;
			
			case 2:
				var box = _tagsBox;
				break;
			
			case 3:
				var box = _relatedBox;
				break;
		}
		
		// Force blur() when clicking off a textbox to another item in middle
		// pane, since for some reason it's not being called automatically
		if (_lastItem && _lastItem != item) {
			switch (index) {
				case 0:
				case 2:
					box.blurOpenField();
					// DEBUG: Currently broken
					//box.scrollToTop();
					break;
			}
		}
		
		_lastItem = item;
		
		if (index == 1) {
			var editable = ZoteroPane_Local.canEdit();
			_notesButton.hidden = !editable;
			
			while(_notesList.hasChildNodes()) {
				_notesList.removeChild(_notesList.firstChild);
			}
			
			var notes = Zotero.Items.get(item.getNotes());
			if (notes.length) {
				for(var i = 0; i < notes.length; i++) {
					let id = notes[i].id;
					
					var icon = document.createElement('image');
					icon.className = "zotero-box-icon";
					icon.setAttribute('src','chrome://zotero/skin/treeitem-note.png');
					
					var label = document.createElement('label');
					label.className = "zotero-box-label";
					var title = Zotero.Notes.noteToTitle(notes[i].getNote());
					title = title ? title : Zotero.getString('pane.item.notes.untitled');
					label.setAttribute('value', title);
					label.setAttribute('flex','1');	//so that the long names will flex smaller
					label.setAttribute('crop','end');
					
					var box = document.createElement('box');
					box.setAttribute('class','zotero-clicky');
					box.addEventListener('click', function () { ZoteroPane_Local.selectItem(id); });
					box.appendChild(icon);
					box.appendChild(label);
					
					if (editable) {
						var removeButton = document.createElement('label');
						removeButton.setAttribute("value","-");
						removeButton.setAttribute("class","zotero-clicky zotero-clicky-minus");
						removeButton.addEventListener('click', function () { ZoteroItemPane.removeNote(id); });
					}
					
					var row = document.createElement('row');
					row.appendChild(box);
					if (editable) {
						row.appendChild(removeButton);
					}
					
					_notesList.appendChild(row);
				}
			}
			
			_updateNoteCount();
			return;
		}
		
		if (mode) {
			box.mode = mode;
		}
		else {
			box.mode = 'edit';
		}
		box.item = item;
		if (index == 0){
			Zotero.CustomForms.init();
			var customfields = Zotero.CustomForms.DB.query("SELECT fieldID,value FROM customfieldsvalues WHERE itemID = (?)",item.getID());
			for (current in customfields){
				var row = box._dynamicFields;
		        var new_row = document.createElement("row");
		        var label = document.createElement("label");
		        var fieldnameandlabel = Zotero.DB.query("SELECT fieldname,label FROM fieldsCombined WHERE fieldID = (?)",current[0]);
		        var fieldvalue = current[1];
		        label.setAttribute("fieldname", fieldnameandlabel[0]);
		        label.setAttribute("value", fieldnameandlabel[1] + ": ");
		        new_row.appendChild(label);
		        row.appendChild(new_row);
		    	}
		}
	}
	
	
	this.addNote = function (popup) {
		ZoteroPane_Local.newNote(popup, _lastItem.id);
	}
	
	
	this.removeNote = function (id) {
		var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
								.getService(Components.interfaces.nsIPromptService);
		if (ps.confirm(null, '', Zotero.getString('pane.item.notes.delete.confirm'))) {
			Zotero.Items.trash(id);
		}
	}
	
	
	function _updateNoteCount() {
		var c = _notesList.childNodes.length;
		
		var str = 'pane.item.notes.count.';
		switch (c){
		case 0:
			str += 'zero';
			break;
		case 1:
			str += 'singular';
			break;
		default:
			str += 'plural';
			break;
		}
		
		_notesLabel.value = Zotero.getString(str, [c]);
	}
	
	// Extension addition: Open dialog for custom field creation
	this.openDialog = function () {
		var selectedItems = ZoteroPane_Local.getSelectedItems();
        selectedItems.push(document.getElementById("zotero-editpane-item-box"));
        selectedItems.push(this);
        window.openDialog("chrome://zotcustom_form/content/createField.xul",
                          "",
                          "chrome,centerscreen,modal,resizable=no",
                          selectedItems);
    };
}
addEventListener("load", function(e) { ZoteroItemPane.onLoad(e); }, false);