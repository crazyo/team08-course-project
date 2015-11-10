var BatchTags = new function() {
    this.init = init;

    function init() {
        var group = document.getElementById("tag-batch");
        var tagnames = [];
        var tags = Zotero.Tags.getAll();
        for (var item in tags) {
            if (!tags.hasOwnProperty(item)) {
                continue;
            }

            tagnames.push(tags[item].name);
        }
        for (var i = 0; i < tagnames.length; i++) {
            var tagbox = document.createElement("checkbox");
            tagbox.setAttribute("label", tagnames[i]);
            group.appendChild(tagbox);
        }
    }
};
        var tagsDialog = document.getElementById("batch-edit-tags-dialog");
        document.getElementById("add-tags-name").setAttribute("visible", "true");

    },




    function showAddTag(){
        document.getElementById("add-tags-name").setAttribute("visible", "true");
    },

    function submit(){

    },

    function accept(){
        var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
        .getService(Components.interfaces.nsIPromptService);

        ps.confirm(window, "Duplication Check", ZoteroPane.itemsView.selection.count);
    },
};
