var ZotLink_Dialog = new function() {
    this.init = init;
    this.accept = accept;
    this.updateCollections = updateCollections;

    this._librarySelections = [];
    this._collectionSelections = [];

    function init() {
        var selectedItems = window.arguments[0];
        var libraryListMenu = document.getElementById("zotlink-dialog-library-list");
        var groups = Zotero.Groups.getAll();
        var newGroupEntry;

        // items selected should belong to the same library
        // so only need to inspect the first item
        var representative = selectedItems[0];
        // case 1 - selected items belong to My Library
        if (!representative._libraryID) {
            for (var i = 0; i < groups.length; i++) {
                newGroupEntry = document.createElement("menuitem");
                newGroupEntry.setAttribute("label", groups[i]._name);
                libraryListMenu.appendChild(newGroupEntry);
                this._librarySelections.push(groups[i]._libraryID);
            }
        }
        // case 2 - selected items belong to a group library
        else {
            newGroupEntry = document.createElement("menuitem");
            newGroupEntry.setAttribute("label", "My Library");
            libraryListMenu.appendChild(newGroupEntry);
            // use 0 as the special library id for My Library
            this._librarySelections.push(0);

            var currentLibraryID = representative._libraryID;
            for (var i = 0; i < groups.length; i++) {
                if (groups[i]._libraryID !== currentLibraryID) {
                    newGroupEntry = document.createElement("menuitem");
                    newGroupEntry.setAttribute("label", groups[i]._name);
                    libraryListMenu.appendChild(newGroupEntry);
                    this._librarySelections.push(groups[i]._libraryID);
                }
            }
        }

        // select the first item by default
        if (this._librarySelections) {
            document.getElementById("zotlink-dialog-library-list-menu").selectedIndex = 0;
        }
        // set the corresponding collections
        this.updateCollections();
    }

    function accept() {
        var selectedItems = window.arguments[0];
        var targetLibraryID = this._librarySelections[document.getElementById("zotlink-dialog-library-list-menu").selectedIndex];
        var targetCollectionID = this._collectionSelections[document.getElementById("zotlink-dialog-collection-list-menu").selectedIndex];

        for (var i = 0; i < selectedItems.length; i++) {
            var newItem = new Zotero.Item;
            newItem.setType(selectedItems[i].itemTypeID);
            // add the item to the target library
            newItem.libraryID = targetLibraryID || null;

            // TODO
            // add other fields as well
            newItem.setField("title", selectedItems[i].getField("title"));

            var id = newItem.save();
            // add the item to the target collection
            if (targetCollectionID) {
                Zotero.Collections.get(targetCollectionID).addItem(id);
            }
        }
    }

    function updateCollections() {
        var selectedIndex = document.getElementById("zotlink-dialog-library-list-menu").selectedIndex;
        var selectedLibraryID = this._librarySelections[selectedIndex];
        var collectionListMenu = document.getElementById("zotlink-dialog-collection-list");
        var newCollectionEntry;

        // reset collection list menu
        while (collectionListMenu.firstChild) {
            collectionListMenu.removeChild(collectionListMenu.firstChild);
        }
        // reset legacy _collectionSelections list
        this._collectionSelections = [];

        newCollectionEntry = document.createElement("menuitem");
        newCollectionEntry.setAttribute("label", "<root>");
        collectionListMenu.appendChild(newCollectionEntry);
        // use 0 as the special collection id for library root
        this._collectionSelections.push(0);

        var sql;
        // My Library
        if (selectedLibraryID === 0) {
            sql = "SELECT * FROM collections WHERE libraryID IS NULL;";
        }
        // group libraries
        else {
            sql = "SELECT * FROM collections WHERE libraryID=" + selectedLibraryID;
        }
        var rows = Zotero.DB.query(sql);
        for (var i = 0; i < rows.length; i++) {
            newCollectionEntry = document.createElement("menuitem");
            newCollectionEntry.setAttribute("label", rows[i].collectionName);
            collectionListMenu.appendChild(newCollectionEntry);
            this._collectionSelections.push(rows[i].collectionID);
        }

        // select the first item by default
        if (this._collectionSelections) {
            document.getElementById("zotlink-dialog-collection-list-menu").selectedIndex = 0;
        }
    }
};
