var BatchTags = new function() {
    var tagsDialog = document.getElementById("batch-edit-tags-dialog");
    var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                   .getService(Components.interfaces.nsIPromptService);

    this.init = init;
    this.accept = accept;


    function init() {
        var btn = document.createElement("menuitem");        // Create a <button> elementxwx
        btn.setTextContent("Add Tags");
        tagsDialog.appendChild(btn);
    }

    function accept(){
        ps.confirm(window, "Duplication Check", ZoteroPane.itemsView.selection.count);
    }
};