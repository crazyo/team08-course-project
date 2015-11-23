Components.utils.import("resource://gre/modules/NetUtil.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

//save custom citation to csl file locally
var SaveCustom = new function() {

	var format = opener.document.getElementById("new-citation-format");
	this.save = function() {
        var saveName = document.getElementById("save-citation-textbox");
        //using https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O#Creating_a_file_object
        //create file and save to style folder
        var file = Components.classes["@mozilla.org/file/local;1"].
        createInstance(Components.interfaces.nsILocalFile);

        //wip: can save anywhere.
        file.initWithPath("C:\\Users\\Raunak\\Desktop\\zotero proj\\team08-course-project\\src\\modules\\zotero\\styles");
        file.append(saveName.value + ".csl");

        //write to file
        var ostream = FileUtils.openSafeFileOutputStream(file);
        var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
        createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var istream = converter.convertToInputStream(this.parseCitation(format.value, saveName.value));

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

    //parse format string and create csl file ready to install
    this.parseCitation = function(customFormat, saveName){
        var finalCSL;
        //get rid of bracers from format in prev window
        var removeBracersFormat = customFormat.split('{').join('');
        var finalFormat = removeBracersFormat.split('}');
        //required fields for csl file
        var requiredFields = '<?xml version="1.0" encoding="utf-8"?>\n<style xmlns="http://purl.org/net/xbiblio/csl" ' +
            'class="in-text" version="1.0" demote-non-dropping-particle="never">\n\t<info>\n\t\t<title>' + saveName +
            '</title>\n\t\t<id>http://www.zotero.org/styles/' + saveName +
            '</id>\n\t\t<updated>2015-04-07T11:18:00+00:00</updated>\n\t</info>\n\t<bibliography et-al-min="6" ' +
            'et-al-use-first="1" second-field-align="flush" entry-spacing="0" line-spacing="2">\n\t' +
            '<layout>\n\t\t<group delimiter=", " prefix="(" suffix=")">\n';
        finalCSL = requiredFields;
        //go through format fields and create csl using output
        var i;
        for(i = 0; i < finalFormat.length-1; i++){
            finalCSL += '\t\t\t<text variable="' + finalFormat[i] + '" suffix=","/>\n';
        }
        finalCSL += '\t\t</group>\n\t</layout>\n\t</bibliography>\n</style>';
        return finalCSL;
    }
}