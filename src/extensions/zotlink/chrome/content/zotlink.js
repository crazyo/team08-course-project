Zotero.ZotLink = {
    DB: null,

    // cache database invoking result to reduce database-access overhead
    links: [],


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

        var observerID = Zotero.Notifier.registerObserver(this.observer, ["item"]);

        window.addEventListener("unload", function() {
            Zotero.Notifier.unregisterObserver(observerID);
        });
    },

    observer: {
        notify: function(event, type, ids, extra) {
            var sql;
            if (event === "delete") {
                sql = "DELETE FROM links WHERE item1id IN (" + ids + ") OR item2id IN (" + ids + ");";
                this.DB.query(sql);
                // also update the cache to reduce database access
                for (var i = this.links.length - 1; i >= 0; i--) {
                    if (ids.indexOf(this.links[i][0]) !== -1 || ids.indexOf(this.links[i][1] !== -1)) {
                        this.links.splice(i, 1);
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

    createLink: function(oldID, newID) {
        var sql = "INSERT INTO links VALUES (" + oldID + ", " + newID + ");";
        this.DB.query(sql);
        // also update the cache to reduce database access
        this.links.push([oldID, newID]);
    },
};

window.addEventListener("load", function() { Zotero.ZotLink.init(); });
