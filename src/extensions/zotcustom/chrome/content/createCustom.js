var ZotCustom = new function() {
	
	var caretPos = 0;			// Keeps track of cursor position in textbox
	var listUpdated = false;	// Checks if drop down has already been updated
	
	//update the ddl based on items forms
    //can probably use getUsedFields from items.js
	this.updateList = function(){
		// If the list has already been updated, don't do it again.
		if (listUpdated) return;
		
		var io = {singleSelection:true};
		window.openDialog('chrome://zotero/content/selectItemsDialog.xul', '', 'chrome,modal', io);
		var selectedItemID = io.dataOut[0];
		var selectedItem = Zotero.Items.get(selectedItemID);
		var mylist = document.getElementById("fields-drop-down");
		// Insert fields w/ values for selected item
		var i;
		for (i in selectedItem._itemData) {
            var name = Zotero.ItemFields.getName(i);
			var val = selectedItem.getField(i);
            //check if field has a value
			if(val != ""){
				mylist.appendItem(name + ": " + val, name);
			}
            //not too sure bout this prt..
			if (name == 'version') {
				// Changed in API v3 to avoid clash with 'version' above
				// Remove this after https://github.com/zotero/zotero/issues/670
				name = 'versionNumber';
			}
		}
		
		// Set list to updated
		if (selectedItem) listUpdated = true;
	}
	
	/*
	 * Returns the caret (cursor) position of the specified text field.
	 */
	function getCaretPos (field) {

		var pos = 0;

		// IE
		if (document.selection) {	
			field.focus(); 										// Set focus on element
			var sel = document.selection.createRange(); 		// Get empty selection range
			sel.moveStart('character', -field.value.length); 	// Move selection to 0 position
			pos = sel.text.length; 								// The caret position is selection length
		}

		// Firefox
		else if (field.selectionStart || field.selectionStart == '0')
			pos = field.selectionStart;

		return pos;
	}
	
	/*
	 * Sets the caret (cursor) position of the specified text field.
	 */
	function setCaretPos(id, pos) {
		var elem = document.getElementById(id);

		if(elem != null) {
			if(elem.createTextRange) {
				var range = elem.createTextRange();
				range.move('character', pos);
				range.select();
			}
			else {
				if(elem.selectionStart) {
					elem.focus();
					elem.setSelectionRange(pos, pos);
				}
				else
					elem.focus();
			}
		}
	}
	
	// Drop-down selection function
	this.inputSelection = function(){
		var mylist = document.getElementById("fields-drop-down");
		var textbox = document.getElementById("new-citation-format")
		
		// Insert 'insert' between 'front' and 'back'
		var insert = "{" + mylist.selectedItem.value + "}"
		var front = (textbox.value).substring(0,caretPos);  
		var back = (textbox.value).substring(caretPos,textbox.value.length); 
		
		textbox.value = front + insert + back;
		textbox.focus();
	};
	
	// Textbox blurred function
	this.saveCaret = function(){
		caretPos = getCaretPos(document.getElementById("new-citation-format"))		//Remember cursor location for later use
	};
	
	// Textbox focused function
	this.setCaret = function(){
		setCaretPos ("new-citation-format", caretPos);								// Set cursor to previous location
	};
}