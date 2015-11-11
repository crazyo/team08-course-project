# Our Group Website:
https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/

=====
- Deliverable 1 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/index.html
- Deliverable 2 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/d2.html
    (there is also a copy of everything in the repo under /project-management in case anything is broken on the website)
- **-> Deliverable 3 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/d3.html <-**

# Build Instructions:
1. ***Make a copy of config.sh.seed and name the copy config.sh before following the instructions.***
2. Follow instructions to build Zotero:
    https://www.zotero.org/support/dev/client_coding/building_the_standalone_client#building
3. Launch Zotero, go to Tools -> Add-ons -> Install Add-on From File..., navigate into src/extensions and choose plugins (.xpi files) to install.
    (folder with the same name as the plugin contains the source code for that plugin)
4. Click Restart Zetoro and enjoy! 

# Plugins:
- ZotLink:
    - Integrates an option into the right click context menu that enables the user to make a linked copy of the seleted item(s) to another library.
    - Clicking on that option fires up a dialog for the user to choose the destination library and collection.
    - By hiting OK, a copy of the selected item(s) will be generated in the target library and the target collection.
    - WIP (To link the copy to the original item.)

- BatchEditing:
    - Allow user to modify info and add/delete tags for multiple items at once. 
    - Click the icon right to the tags search bar(bottom left of UI), it will bring up a context menu.
    - Select batch edit tags, it opens up a dialog. Right now it's able to show what tags are currently in the library.
    - WIP (merge & batch add more tags).


	
- ZotCustom:
	- Gives the user an option to create their own custom citation format when making a new bibliography.
	- WIP
- ZotCustom_fields:
	-Allows users to create their own forms with their own custom fields.
