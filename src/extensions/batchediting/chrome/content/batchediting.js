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
    },
};

window.addEventListener("load", function() { Zotero.BatchEditing.init(); });
