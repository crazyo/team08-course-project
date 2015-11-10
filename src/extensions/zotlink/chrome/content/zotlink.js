Zotero.ZotLink = {
    DB: null,
    // cache database invoking result to reduce database-access overhead
    links: null,

    // current observerID
    observerID: null,


    init: function() {
        // connect to the database (create if necessary)
        this.DB = new Zotero.DBConnection("zotlink");
        if (!this.DB.tableExists("links")) {
            this.DB.query("CREATE TABLE links (item1id INT, item2id INT);");
        }

        // retrieve data from database, store in cache
        var sql = "SELECT * FROM links;";
        var rows = this.DB.query(sql);
        this.links = new _LinkGraph(rows);

        this.observerID = Zotero.Notifier.registerObserver(this.observer, ["item"]);

        window.addEventListener("unload", function() {
            Zotero.Notifier.unregisterObserver(this.observerID);
        });
    },

    observer: {
        notify: function(event, type, ids, extra) {
            // keep a reference to our ZotLink object
            var zotlink = Zotero.ZotLink;

            var sql;
            if (event === "delete") {
                sql = "DELETE FROM links WHERE item1id IN (" + ids + ") OR item2id IN (" + ids + ");";
                zotlink.DB.query(sql);
                // also update the cache to reduce database access
                for (var i = 0; i < ids.length; i++) {
                    zotlink.links.removeLinks(ids[i]);
                }
            }
            else if (event === "modify") {
                // loop over changed items
                for (var i = 0; i < ids.length; i++) {
                    // get the changed item
                    var id = ids[i];
                    var source = Zotero.Items.get(id);

                    // change all items that are linked to this item
                    var targets = zotlink.links.findLinks(id);
                    for (var j = 0; j < targets.length; j++) {
                        var target = Zotero.Items.get(targets[j]);

                        // temporarily stop listening to events
                        Zotero.Notifier.unregisterObserver(zotlink.observerID);

                        source.clone(false, target);
                        target.save();

                        // resume listening to events
                        zotlink.observerID = Zotero.Notifier.registerObserver(zotlink.observer, ["item"]);
                    }
                }
            }
        },
    },

    openDialog: function() {
        var selectedItems = ZoteroPane_Local.getSelectedItems();
        window.openDialog("chrome://zotlink/content/makeLinkedCopy.xul",
                          "",
                          "chrome,centerscreen,modal,resizable=no",
                          selectedItems);
    },

    createLinkedCopy: function(source, targetLibraryID, targetCollectionID) {
        // temporarily stop listening to events
        Zotero.Notifier.unregisterObserver(this.observerID);

        // 1. make a copy at the target location
        var newItem, newItemID;

        newItem = new Zotero.Item(source.itemTypeID);
        // add the item to the target library
        newItem.libraryID = targetLibraryID || null;
        newItemID = newItem.save();
        newItem = Zotero.Items.get(newItemID);
        // copy over all the information
        source.clone(false, newItem);
        newItem.save();
        // add the item to the target collection
        if (targetCollectionID) {
            Zotero.Collections.get(targetCollectionID).addItem(newItemID);
        }

        // 2. link them
        var sql = "INSERT INTO links VALUES (" + source.id + ", " + newItemID + ");";
        this.DB.query(sql);
        // also update the cache to reduce database access
        this.links.addLink([source.id, newItemID]);

        // resume listening to events
        this.observerID = Zotero.Notifier.registerObserver(this.observer, ["item"]);
    },

    createLinkedCopies: function(sources, targetLibraryID, targetCollectionID) {
        for (var i = 0; i < sources.length; i++) {
            this.createLinkedCopy(sources[i], targetLibraryID, targetCollectionID);
        }
    },
};

window.addEventListener("load", function() { Zotero.ZotLink.init(); });


function _LinkGraph(pairs) {
    // build graph (as an adjacency list)
    this.graph = {};
    _buildGraph(pairs);

    this.addLink = function(pair) {
        var item1id = pair[0],
            item2id = pair[1];

        if (!this.graph.hasOwnProperty(item1id)) {
            this.graph[item1id] = [item2id];
        }
        else {
            this.graph[item1id].push(item2id);
        }
        if (!this.graph.hasOwnProperty(item2id)) {
            this.graph[item2id] = [item1id];
        }
        else {
            this.graph[item2id].push(item1id);
        }
    };

    // find id of all linked items to the given item using BFS
    this.findLinks = function(itemid) {
        var tovisit = [itemid],
            visted  = [];

        while (tovisit.length) {
            var current = tovisit.shift();
            visted.push(current);

            if (!this.graph[current]) {
                continue;
            }

            for (var i = 0; i < this.graph[current].length; i++) {
                var candidate = this.graph[current][i];
                if (tovisit.indexOf(candidate) === -1 &&
                    visted.indexOf(candidate)  === -1) {
                    tovisit.push(candidate);
                }
            }
        }

        // the first item in the visited list is the given item itself
        visted.shift();
        return visted;
    };

    // remove all links to the item
    this.removeLinks = function(itemid) {
        if (!this.graph[itemid]) {
            return;
        }

        delete this.graph[itemid];
        for (var source in this.graph) {
            // skip if the current property is not an item
            if (!this.graph.hasOwnProperty(source)) {
                continue;
            }

            for (var j = 0; j < this.graph[source].length; j++) {
                if (this.graph[source][j] === itemid) {
                    this.graph[source].splice(j, 1);
                    break;
                }
            }
            // delete the list if it becomes empty
            if (!this.graph[source].length) {
                delete this.graph[source];
            }
        }
    };

    function _buildGraph(pairs) {
        for (var i = 0; i < pairs; i++) {
            this.addLink(pairs[i]);
        }
    }
}
