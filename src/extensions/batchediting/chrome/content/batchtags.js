var BatchTags = new function() {
    this.init = init;


    // Queries to execute on accept.
    this.query = [];


    function init (){
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
            tagbox.setAttribute("id", tagnames[i]);
            tagbox.setAttribute("label", tagnames[i]);
            group.appendChild(tagbox);
        }

    }

    this.renameTags = function (){
        var group = document.getElementById("tag-batch");
        var tags = this.getCheckedBoxes("tag-batch");

        if (!tags.length){
            return;
        } else{
            if (document.getElementById("input-new-name").getAttribute("hidden") == "true"){
                document.getElementById("input-new-name").setAttribute("hidden","false");
            } else{

                // Case of Renaming
                var newLabel = document.getElementById("input-new-name").value;
                var toModify = document.getElementById(tags[0].id);

                this.query.push("this.renameTag(\"" + tags[0].label + "\", \"" + newLabel + "\")");
                toModify.label = newLabel;
                toModify.id = newLabel;

                // Case of Merging
                if (tags.length > 1){
                    for (i = 1; i < tags.length; i++){
                        var toDelete = document.getElementById(tags[i].id);
                        this.query.push("this.renameTag(\"" + tags[i].label + "\", \"" + newLabel + "\")");
                        toDelete.parentNode.removeChild(toDelete);
                    }
                }

                // Set the input box back to hidden.
                document.getElementById("input-new-name").setAttribute("hidden","true");
            }
        }

    }

    this.deleteTags = function (){
        var group = document.getElementById("tag-batch");
        var tags = this.getCheckedBoxes("tag-batch");

        if (tags.length > 0){
            for(i = 0; i < tags.length; i++){
                var toDelete = document.getElementById(tags[i].id);
                this.query.push("this.deleteTag(\"" + tags[i].label + "\")");
                toDelete.parentNode.removeChild(toDelete);
            }
        } else{
            return;
        }
    }


    this.acceptChanges = function(){
        document.getElementById("testing").value = this.query;
        return this.query;
    }

    this.getCheckedBoxes = function(chkboxName) {
      var checkboxes = document.getElementById(chkboxName);
      var checkboxesChecked = [];

      // loop over them all
      for (i=0; i<checkboxes.children.length; i++) {
         // And stick the checked ones onto an array...
         if (checkboxes.children[i].checked) {
            checkboxesChecked.push(checkboxes.children[i]);
         }
      }
      // Return the array if it is non-empty, or null
      return checkboxesChecked;
    }


};
