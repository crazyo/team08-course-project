// only create main object once
if (!Zotero.ZotCustom_Form) {
    var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                           .getService(Components.interfaces.mozIJSSubScriptLoader);
    loader.loadSubScript("chrome://zotcustom_form/content/customItemPane.js");
    loader.loadSubScript("chrome://zotcustom_form/content/createField.js");
}
