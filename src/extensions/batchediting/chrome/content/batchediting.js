Zotero.BatchEditing = {

    init: function() {
        var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                    .getService(Components.interfaces.nsIPromptService);
        var tagmenu = document.getElementById("view-settings-popup");
        var batchedit = document.createElement("menuitem");
        var tags = Zotero.Tags.getAll();
        for (var property in tags) {
            promptService.alert(null, "number", property);
            promptService.alert(null, "dsfds", tags[property].name);
            promptService.alert(null, "dsfds", tags[property].type);
        }
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
