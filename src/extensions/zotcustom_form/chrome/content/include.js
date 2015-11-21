// only create main object once
if (!Zotero.ZotCustom_form) {
    var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                           .getService(Components.interfaces.mozIJSSubScriptLoader);
    //loader.loadSubScript("chrome://zotcustom_field/content/zotcustom_field.js");
}
