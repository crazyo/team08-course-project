var addCustom_field() = new function() 
	{
		var tree = document.getElementById("tree");
		var io = {singleSelection:true};
		window.openDialog('chrome://zotero/content/selectItemsDialog.xul', '', 'chrome,modal', io);
		var selectedItemID = io.dataOut[0];
		var selectedItem = Zotero.Items.get(selectedItemID);
		var newfield = Zotero.Items.get(new_field);
		selectedItem.setField(new_field,"");
	}