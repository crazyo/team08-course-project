Zotero.BatchEditing = {

    init: function() {
        var observerID = Zotero.Notifier.registerObserver(this.observer, ["item"]);
        var itempane = document.getElementById('otero-item-pane-content');
        var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;

        if (ZoteroPane.itemsView.selection.count > 1){
            ps.confirm(window, "Duplication Check", ZoteroPane.itemsView.selection.count);
        }
        window.addEventListener("unload", function() {
            Zotero.Notifier.unregisterObserver(observerID);
        });
    },



    edittags: function(){
        var selectedItems = ZoteroPane.getSelectedItems();
        window.openDialog("chrome://batchediting/content/batchtags.xul",
                          "",
                          "chrome,centerscreen,modal,resizable=no",
                          selectedItems);
    },

    observer: {
        notify: function(event, type, ids, extra) {


            if (event === "add" || event == 'modify' || event == 'delete') {
                var a = ZoteroPane.getSelectedItems();
                var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                   .getService(Components.interfaces.nsIPromptService);
                ps.confirm(window, "Duplication Check", ZoteroPane.itemsView.selection.count);
            }
        },
    },
};

window.addEventListener("load", function() { Zotero.BatchEditing.init(); });
