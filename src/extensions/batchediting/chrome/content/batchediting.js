Zotero.BatchEditing = {
            

    init: function() {
        var tagmenu = document.getElementById("view-settings-popup");
        var batchedit = document.createElement("menuitem");
        batchedit.setAttribute("label", "batch edit tags");
        batchedit.setAttribute("oncommand", "Zotero.BatchEditing.openDialog();");
        tagmenu.appendChild(batchedit);

        var observerID = Zotero.Notifier.registerObserver(this.observer, ["item"]);

        window.addEventListener("unload", function() {
            Zotero.Notifier.unregisterObserver(observerID);
        });
    },

    openDialog: function(){
        window.openDialog("chrome://batchediting/content/batchtags.xul",
                          "",
                          "chrome,centerscreen,modal,resizable=no");


    edittags: function(){
        var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
        var selectedItems = ZoteroPane.getSelectedItems();

        if (ZoteroPane.itemsView.selection.count > 1){
            window.openDialog("chrome://batchediting/content/batchtags.xul",
                              "",
                              "chrome,centerscreen,modal,resizable=yes",
                              selectedItems);
        } else{
            ps.confirm(window, "Warning", "You have to select more items to use batch edit.");
        }
    },

    observer: {
        notify: function(event, type, ids, extra) {

            if (event === "add" || event == 'modify' || event == 'delete') {
                var a = ZoteroPane.getSelectedItems();
                ps.confirm(window, "Duplication Check", ZoteroPane.itemsView.selection.count);
            }
        },
    },
};

window.addEventListener("load", function() { Zotero.BatchEditing.init(); });
