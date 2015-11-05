Zotero.ZotLink = {
    DB: null,
    // cache database invoking result to reduce database-access overhead
    links: [],

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
        for (var i = 0; i < rows.length; i++) {
            this.links.push([Number(rows[i].item1id), Number(rows[i].item2id)]);
        }

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
                for (i = zotlink.links.length - 1; i >= 0; i--) {
                    if (ids.indexOf(zotlink.links[i][0]) !== -1 || ids.indexOf(zotlink.links[i][1] !== -1)) {
                        zotlink.links.splice(i, 1);
                    }
                }
            }
            else if (event === "modify") {
                // loop over changed items
                for (var i = 0; i < ids.length; i++) {
                    // get the changed item
                    var id = ids[i];
                    var source = Zotero.Items.get(id);

                    // change all items that are linked to this item
                    var target;
                    for (var j = 0; j < zotlink.links.length; j++) {
                        if (zotlink.links[j][0] !== id && zotlink.links[j][1] !== id) {
                            continue;
                        }

                        target = zotlink.links[j][0] === id ?
                                 Zotero.Items.get(zotlink.links[j][1]) :
                                 Zotero.Items.get(zotlink.links[j][0]);

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
        this.links.push([source.id, newItemID]);

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
