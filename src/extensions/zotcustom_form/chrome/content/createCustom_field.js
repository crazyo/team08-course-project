var createCustom_field() = new function() 
	{
		this.init = init;
		this.create = create;
		function create()
		{
			var tree = document.getElementById("tree");
			var io = {singleSelection:true};
			window.openDialog('chrome://zotero/content/selectItemsDialog.xul', '', 'chrome,modal', io);
			var selectedItemID = io.dataOut[0];
			var selectedItem = Zotero.Items.get(selectedItemID);
			var newfield = document.getElementById(new_field);
			selectedItem.setField(newfield,"");
		}
	}