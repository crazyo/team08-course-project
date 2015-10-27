Zotero.ZotLink = {

    ///////////////////////////////////////////////////////////////////////////
    // init: function() {
    //     var observerID = Zotero.Notifier.registerObserver(this.observer, ["item"]);
    //     window.addEventListener("unload", function() {
    //         Zotero.Notifier.unregisterObserver(observerID);
    //     });
    // },
    ///////////////////////////////////////////////////////////////////////////

    openDialog: function() {
        var selectedItems = ZoteroPane_Local.getSelectedItems();
        window.openDialog("chrome://zotlink/content/makeLinkedCopy.xul",
                          "",
                          "chrome,centerscreen,modal,resizable=no",
                          selectedItems);
    },

    /* TODO
     * observer should trigger prompt when an item is dragged into another library
     */
    ///////////////////////////////////////////////////////////////////////////
    // observer: {
    //     notify: function(event, type, ids, extra) {
    //         if (event === "add") {
    //             var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
    //                                .getService(Components.interfaces.nsIPromptService);
    //             ps.confirm(window, "Duplication Check", "Do you want to check possible duplications of this item in other libraries?");
    //         }
    //     },
    // },
    ///////////////////////////////////////////////////////////////////////////
};

// window.addEventListener("load", function() { Zotero.ZotLink.init(); });
