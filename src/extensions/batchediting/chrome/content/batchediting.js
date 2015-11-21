Zotero.BatchEditing = {
    ps: Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                .getService(Components.interfaces.nsIPromptService),

    init: function() {
        // var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").ZoteroPane;
        // var tagmenu = document.getElementById("view-settings-popup");
        // var batchedit = document.createElement("menuitem");
    
        // batchedit.setAttribute("label", "Batch Edit Tags");
        // batchedit.setAttribute("oncommand", "Zotero.BatchEditing.openDialog();");
        // tagmenu.appendChild(batchedit);
        var observerID = Zotero.Notifier.registerObserver(this.observer, ["item"]);

        window.addEventListener("unload", function() {
            Zotero.Notifier.unregisterObserver(observerID);
        });
    },

    openDialog: function(){

        window.openDialog("chrome://batchediting/content/batchtags.xul","","chrome,centerscreen,resizable=yes");
    },

    test: function(){
        //window.alert("test");
        var ret = this.ps.confirm(null, "Confirm", "Confirmtest to make changes?");
        window.alert(ret);
    },

    acceptChanges: function(listOfActions){

        if (this.ps.confirm(null, "Confirm", "Confirm to make changes?")){
            for (i=0;i < listOfActions.length; i++){

                // Execute queries.
                eval(listOfActions[i]);
            };
        };
    },


    //Zotero.Tags endpoint
    renameTag: function(tagName, newTagName){
        console.log(tagName);
        tagID = this.getTagIDFromName(tagName);

        Zotero.Tags.rename(tagID, newTagName);
    },

    deleteTag: function(tagName){
        tagID = this.getTagIDFromName(tagName);

        //console.log(Zotero.Tags.get(tagID));
        Zotero.Tags.erase(tagID);
    },


    getTagIDFromName: function(tagName){
        var prepared = "SELECT tagID FROM tags WHERE name=?";
        var param = [tagName];
        return Zotero.DB.valueQuery(prepared, param);
    }
};

window.addEventListener("load", function() { Zotero.BatchEditing.init(); });
