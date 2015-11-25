// only create main object once
if (!Zotero.ZotCustom) {
    var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                           .getService(Components.interfaces.mozIJSSubScriptLoader);
    loader.loadSubScript("chrome://zotcustom/content/zotcustom.js");
}
