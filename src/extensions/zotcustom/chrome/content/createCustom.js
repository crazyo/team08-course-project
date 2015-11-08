var ZotCustom = new function() {
	//update the ddl based on items forms
	this.updateList = function(){
	};

	this.inputSelection = function(){
		var mylist=document.getElementById("zotc1");
		document.getElementById("newcitation").value+=mylist.selectedItem.value;
	};
}