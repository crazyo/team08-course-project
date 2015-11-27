Components.utils.import("resource://gre/modules/NetUtil.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

var SaveCustom = new function() {

	var format = document.getElementById("new-citation-format");

    //save custom citation to csl file locally
	this.save = function() {
        //using csledit from zotero source code for filepicker part
        //create file and save to folder user selects
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        fp.init(window, "Save As", Components.interfaces.nsIFilePicker.modeSave);
        //add csl extension
        fp.appendFilter("Citation Style Language", "*.csl");
        fp.defaultString = ".csl";
        var ret = fp.show();
        if (ret == fp.returnOK || ret == fp.returnReplace) {
            var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].
            createInstance(Components.interfaces.nsIFileOutputStream);
            // write, create, truncate
            fos.init(fp.file, 0x02 | 0x08 | 0x20, 0664, 0);
            var os = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
            createInstance(Components.interfaces.nsIConverterOutputStream);
            os.init(fos, "UTF-8", 0, 0x0000);
            os.writeString(this.parseCitation(format.value, "customCSL"));
            os.close();
            fos.close();
        }
        window.close();
    }

    //parse format string and create csl file ready to install
    this.parseCitation = function(customFormat, saveName){
        var finalCSL;
        //get rid of bracers from format in prev window
        var removeBracersFormat = customFormat.split('{').join('');
        var finalFormat = removeBracersFormat.split('}');
        //required fields for csl file
        finalCSL = '<?xml version="1.0" encoding="utf-8"?>\n<style xmlns="http://purl.org/net/xbiblio/csl" ' +
            'class="in-text" version="1.0" demote-non-dropping-particle="never">\n\t<info>\n\t\t<title>' + saveName +
            '</title>\n\t\t<id>http://www.zotero.org/styles/'  + saveName +
            '</id>\n\t\t<updated>2015-04-07T11:18:00+00:00</updated>\n\t</info>\n\t<bibliography et-al-min="6" ' +
            'et-al-use-first="1" second-field-align="flush" entry-spacing="0" line-spacing="2">\n\t' +
            '<layout>';
        //go through format fields and create csl using users output
        var i;
        for(i = 0; i < finalFormat.length-1; i++){

            //make it the right value for text variable in csl
            switch(finalFormat[i]){

                case "url":
                    finalFormat[i] = "URL";
                    break;

                case "series":
                    finalFormat[i] = "Series";
                    break;

                case "seriesNumber":
                    finalFormat[i] = "collection-number";

                case "shortTitle":
                    finalFormat[i] = "title-short";
                    break;

                case "notes":
                    finalFormat[i] = "annote";
                    break;

                case "pages":
                    finalFormat[i] = "page";
                    break;

                case "callNumber":
                    finalFormat[i] = "call-number";
                    break;

                case "abstractNote":
                    finalFormat[i] = "abstract";
                    break;

                case "numberOfVolumes":
                    finalFormat[i] = "number-of-volumes";
                    break;

                case "archiveLocation":
                    finalFormat[i] = "archive_location";
                    break;

                case "accessDate":
                    finalFormat[i] = "accessed";
                    break;

                case "libraryCatalog":
                    finalFormat[i] = "source";
                    break;

                /*case "dateAdded":
                    finalFormat[i] = "titleshort";
                    break;

                 case "dateAdded":
                    finalFormat[i] = "titleshort";
                    break;

                 case "dateAdded":
                    finalFormat[i] = "titleshort";
                    break;*/

            //check if there is a prefix
            if(!finalFormat[i][0].match("^[a-zA-Z\(\)]+$")){
                finalCSL += '\n\t\t<text variable="' + finalFormat[i].slice(1) + '" prefix="' + finalFormat[i][0] + '"/>';
            }else{
                finalCSL += '\n\t\t<text variable="' + finalFormat[i] + '"/>';
            }
        }
        finalCSL += '\n\t</layout>\n\t</bibliography>\n</style>';
        return finalCSL;
    }
}