var BatchTags = new function() {
    this.init = init;
    //this.refreshed = 0;


    function init() {
        var group = document.getElementById("tag-batch");
        var tagnames = [];
        var tags = Zotero.Tags.getAll();
        //refreshed = refresh + 1;


        for (var item in tags) {
            if (!tags.hasOwnProperty(item)) {
                continue;
            }
            tagnames.push(tags[item].name);
        }

        //document.getElementById("testing").setText(refreshed);


        // //remove childs
        // while(group.hasChildNodes()){
        //     group.removeChild(group.firstChild);
        // }

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

        if (tags.length != 1){
            document.getElementById("")
        } else{

        }
    }

    this.deleteTags = function (){
        var group = document.getElementById("tag-batch");
        var tags = this.getCheckedBoxes("tag-batch");

        if (tags.length != 0){
            for(i = 0; i < tags.length; i++){
                var toDelete = document.getElementById(tags[i].id);
                toDelete.parentNode.removeChild(toDelete);
            }
        } else{
            return;
        }
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
