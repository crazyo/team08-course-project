/*
	Bibliography file with Custom Citation Format extension modifications.
*/

var Zotero_File_Interface_Bibliography = new function() {
	var _io;
	
	// Only changes when explicitly selected
	var lastSelectedStyle,
		lastSelectedLocale;
	
	/*
	 * Initialize some variables and prepare event listeners for when chrome is done
	 * loading
	 */
	 
	 /*
	  *	Delete original groupboxes and items in bibliography creation menu, in order to
	  *	allow the insertion of custom elements inside existing groupboxes (which had no IDs).
	  */
	 var index;
	 var boxes = document.getElementsByTagName( "groupbox" );
	 for (index = 0; index < 4; ++index) {
		boxes[0].remove();
	 }
	 
	this.init = function () {
		// Set font size from pref
		// Affects bibliography.xul and integrationDocPrefs.xul
		var bibContainer = document.getElementById("zotero-bibliography-container");
		if(bibContainer) {
			Zotero.setFontSize(document.getElementById("zotero-bibliography-container"));
		}
		
		if(window.arguments && window.arguments.length) {
			_io = window.arguments[0];
			if(_io.wrappedJSObject) _io = _io.wrappedJSObject;
		} else {
			_io = {};
		}
		
		var listbox = document.getElementById("style-listbox");
		
		// if no style is requested, get the last style used
		if(!_io.style) {
			_io.style = Zotero.Prefs.get("export.lastStyle");
		}
		
		// add styles to list
		var styles = Zotero.Styles.getVisible();
		var index = 0;
		var nStyles = styles.length;
		var selectIndex = null;
		for(var i=0; i<nStyles; i++) {
			var itemNode = document.createElement("listitem");
			itemNode.setAttribute("value", styles[i].styleID);
			itemNode.setAttribute("label", styles[i].title);
			listbox.appendChild(itemNode);
			
			if(styles[i].styleID == _io.style) {
				selectIndex = index;
			}
			index++;
		}
		let requestedLocale;
		if (selectIndex === null) {
			// Requested style not found in list, pre-select first style
			selectIndex = 0;
		} else {
			requestedLocale = _io.locale;
		}
		
		let style = styles[selectIndex];
		lastSelectedLocale = Zotero.Prefs.get("export.lastLocale");
		if (requestedLocale && style && !style.locale) {
			// pre-select supplied locale
			lastSelectedLocale = requestedLocale;
		}
		
		// add locales to list
		Zotero.Styles.populateLocaleList(document.getElementById("locale-menu"));
		
		// Has to be async to work properly
		window.setTimeout(function () {
			listbox.ensureIndexIsVisible(selectIndex);
			listbox.selectedIndex = selectIndex;
			Zotero_File_Interface_Bibliography.styleChanged();
		}, 0);
		
		// ONLY FOR bibliography.xul: export options
		if(document.getElementById("save-as-rtf")) {
			var settings = Zotero.Prefs.get("export.bibliographySettings");
			try {
				settings = JSON.parse(settings);
				var mode = settings.mode;
				var method = settings.method;
			}
			// If not JSON, assume it's the previous format-as-a-string
			catch (e) {
				method = settings;
			}
			if (!mode) mode = "bibliography";
			if (!method) method = "save-as-rtf";
			
			// restore saved bibliographic settings
			document.getElementById('output-mode-radio').selectedItem =
				document.getElementById(mode);
			document.getElementById('output-method-radio').selectedItem =
				document.getElementById(method);
		}
		
		// ONLY FOR integrationDocPrefs.xul: update status of displayAs, set
		// bookmarks text
		if(document.getElementById("displayAs")) {
			if(_io.useEndnotes && _io.useEndnotes == 1) document.getElementById("displayAs").selectedIndex = 1;
		}
		if(document.getElementById("formatUsing")) {
			if(_io.fieldType == "Bookmark") document.getElementById("formatUsing").selectedIndex = 1;
			var formatOption = (_io.primaryFieldType == "ReferenceMark" ? "referenceMarks" : "fields");
			document.getElementById("fields").label =
				Zotero.getString("integration."+formatOption+".label");
			document.getElementById("fields-caption").textContent =
				Zotero.getString("integration."+formatOption+".caption");
			document.getElementById("fields-file-format-notice").textContent =
				Zotero.getString("integration."+formatOption+".fileFormatNotice");
			document.getElementById("bookmarks-file-format-notice").textContent =
				Zotero.getString("integration.fields.fileFormatNotice");
		}
		if(document.getElementById("automaticJournalAbbreviations-checkbox")) {
			if(_io.automaticJournalAbbreviations === undefined) {
				_io.automaticJournalAbbreviations = Zotero.Prefs.get("cite.automaticJournalAbbreviations");
			}
			if(_io.automaticJournalAbbreviations) {
				document.getElementById("automaticJournalAbbreviations-checkbox").checked = true;
			}
		}
		if(document.getElementById("storeReferences")) {
			if(_io.storeReferences || _io.storeReferences === undefined) {
				document.getElementById("storeReferences").checked = true;
				if(_io.requireStoreReferences) document.getElementById("storeReferences").disabled = true;
			}
		}
		
		// set style to false, in case this is cancelled
		_io.style = false;
	};

	/*
	 * Called when locale is changed
	 */
	this.localeChanged = function (selectedValue) {
		lastSelectedLocale = selectedValue;
	};

	/*
	 * Called when style is changed
	 */
	this.styleChanged = function () {
		var selectedItem = document.getElementById("style-listbox").selectedItem;
		lastSelectedStyle = selectedItem.getAttribute('value');
		var selectedStyleObj = Zotero.Styles.get(lastSelectedStyle);
		
		updateLocaleMenu(selectedStyleObj);
		
		//
		// For integrationDocPrefs.xul
		//
		
		// update status of displayAs box based on style class
		if(document.getElementById("displayAs-groupbox")) {
			var isNote = selectedStyleObj.class == "note";
			document.getElementById("displayAs-groupbox").hidden = !isNote;
			
			// update status of formatUsing box based on style class
			if(document.getElementById("formatUsing")) {
				if(isNote) document.getElementById("formatUsing").selectedIndex = 0;
				document.getElementById("bookmarks").disabled = isNote;
				document.getElementById("bookmarks-caption").disabled = isNote;
			}
		}

		// update status of displayAs box based on style class
		if(document.getElementById("automaticJournalAbbreviations-vbox")) {
			document.getElementById("automaticJournalAbbreviations-vbox").hidden =
				!selectedStyleObj.usesAbbreviation;
		}
		
		//
		// For bibliography.xul
		//
		
		// Change label to "Citation" or "Note" depending on style class
		if(document.getElementById("citations")) {
			let label = "";
			if(Zotero.Styles.get(lastSelectedStyle).class == "note") {
				label = Zotero.getString('citation.notes');
			} else {
				label = Zotero.getString('citation.citations');
			}
			document.getElementById("citations").label = label;
		}

		window.sizeToContent();
	};

	/*
	 * Update locale menulist when style is changed
	 */
	function updateLocaleMenu(selectedStyle) {
		Zotero.Styles.updateLocaleList(
			document.getElementById("locale-menu"),
			selectedStyle,
			lastSelectedLocale
		);
	}
	
    this.openDialog = function() {
        window.openDialog("chrome://zotcustom/content/createCustom.xul",
                          "",
                          "chrome,centerscreen,modal,resizable=no");
    }

	this.acceptSelection = function () {
		// collect code
		_io.style = document.getElementById("style-listbox").value;
		
		let localeMenu = document.getElementById("locale-menu");
		_io.locale = localeMenu.disabled ? undefined : localeMenu.value;
		
		if(document.getElementById("output-method-radio")) {
			// collect settings
			_io.mode = document.getElementById("output-mode-radio").selectedItem.id;
			_io.method = document.getElementById("output-method-radio").selectedItem.id;
			// save settings
			Zotero.Prefs.set("export.bibliographySettings",
				JSON.stringify({ mode: _io.mode, method: _io.method }));
		}
		
		// ONLY FOR integrationDocPrefs.xul:
		if(document.getElementById("displayAs")) {
			var automaticJournalAbbreviationsEl = document.getElementById("automaticJournalAbbreviations-checkbox");
			_io.automaticJournalAbbreviations = automaticJournalAbbreviationsEl.checked;
			if(!automaticJournalAbbreviationsEl.hidden && lastSelectedStyle) {
				Zotero.Prefs.set("cite.automaticJournalAbbreviations", _io.automaticJournalAbbreviations);
			}
			_io.useEndnotes = document.getElementById("displayAs").selectedIndex;
			_io.fieldType = (document.getElementById("formatUsing").selectedIndex == 0 ? _io.primaryFieldType : _io.secondaryFieldType);
			_io.storeReferences = document.getElementById("storeReferences").checked;
		}
		
		// remember style and locale if user selected these explicitly
		if(lastSelectedStyle) {
			Zotero.Prefs.set("export.lastStyle", _io.style);
		}
		
		if (lastSelectedLocale) {
			Zotero.Prefs.set("export.lastLocale", lastSelectedLocale);
		}
	};
}
