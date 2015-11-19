Components.utils.import("resource://gre/modules/NetUtil.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
var SaveCustom = new function() {

    var styleList = window.arguments[0];
	var output = window.arguments[1];
	
	this.save = function() {
        var saveName = document.getElementById("save-citation-textbox");
        styleList.appendItem(saveName.value);
        //using https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O#Creating_a_file_object
        //create file and save to style folder
        var file = Components.classes["@mozilla.org/file/local;1"].
        createInstance(Components.interfaces.nsILocalFile);
        //path to their styles folder. gonna fix soon
        file.initWithPath("C:\\Users\\Raunak\\Desktop\\zotero proj\\team08-course-project\\src\\modules\\zotero\\styles");
        file.append(saveName.value + ".csl");

        //write to file
        var ostream = FileUtils.openSafeFileOutputStream(file);
        var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
        createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var istream = converter.convertToInputStream("this gonn be the csl stuff");

        // The last argument (the callback) is optional.
        NetUtil.asyncCopy(istream, ostream, function (status) {
            if (!Components.isSuccessCode(status)) {
                window.alert("Did not write anything.");
                return;
            }

            // Data has been written to the file.
        });
        window.close();
    }
}