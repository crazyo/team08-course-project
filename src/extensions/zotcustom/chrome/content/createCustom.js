var ZotCustom = new function() {
	//update the ddl based on items forms
	this.updateList = function(){
	};
	
	var caretPos = 0;	// Keeps track of cursor position in textbox
	
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
		var mylist = document.getElementById("zotc1");
		var textbox = document.getElementById("newcitation")
		
		// Insert 'insert' between 'front' and 'back'
		var insert = "{" + mylist.selectedItem.value + "}"
		var front = (textbox.value).substring(0,caretPos);  
		var back = (textbox.value).substring(caretPos,textbox.value.length); 
		
		textbox.value = front + insert + back;
		textbox.focus();
	};
	
	// Textbox blurred function
	this.saveCaret = function(){
		caretPos = getCaretPos(document.getElementById("newcitation"))		//Remember cursor location for later use
	};
	
	// Textbox focused function
	this.setCaret = function(){
		setCaretPos ("newcitation", caretPos);								// Set cursor to previous location
	};
}