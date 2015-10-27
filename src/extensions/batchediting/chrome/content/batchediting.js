Zotero.BatchEditing = {

    init: function() {
        var observerID = Zotero.Notifier.registerObserver(this.observer, ["item"]);
        var itempane = document.getElementById('otero-item-pane-content');
        var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;

        Object.observe(ZoteroPane.itemsView.selection.count, function(){
          ps.confirm(window, "Duplication Check", "abc");
        })
        window.addEventListener("unload", function() {
            Zotero.Notifier.unregisterObserver(observerID);
        });
    },

    observer: {
        notify: function(event, type, ids, extra) {



            if (ZoteroPane.itemsView.selection.count > 1){
                var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                   .getService(Components.interfaces.nsIPromptService);
                ps.confirm(window, "Duplication Check", a[0]);
            }


            if (event === "add") {



                var a = ZoteroPane.getSelectedItems();
                var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                   .getService(Components.interfaces.nsIPromptService);
                ps.confirm(window, "Duplication Check", ZoteroPane.itemsView.selection.count);
            }
        },
    },
};

window.addEventListener("load", function() { Zotero.BatchEditing.init(); });
