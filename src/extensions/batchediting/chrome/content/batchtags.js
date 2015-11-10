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
