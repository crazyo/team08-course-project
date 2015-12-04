# Our Group Website:
https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/

=====
- Deliverable 1 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/index.html
- Deliverable 2 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/d2.html
    (there is also a copy of everything in the repo under /project-management in case anything is broken on the website)
- Deliverable 3 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/d3.html
- Deliverable 4 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/d4.html
- Deliverable 5 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/d5.html
- **-> Deliverable 6 Report: https://mathlab.utsc.utoronto.ca/courses/cscc01f15/wangxufe/d6.html <-**

# Build Instructions:
NOTE: ALL OUR CODE IS UNDER extensions/ DIRECTORY; src/ DIRECTORY CONTAINS ZOTERO SOURCE CODE.

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
    - After that, any change to one item will also be reflected in the linked items.
    - Note: indirectly linked items are also synced; say if the user makes a copy of 1 to 2, then make another copy of 1 to 3, the change to 3 will be propagated to both 1 and 2. However, if 1 is deleted, 2 and 3 are no longer synced.

- BatchEditing:
    - Click the cog button right to the fields&tag search bar, it will bring up menu with batch editing features.
    - Select a menuItem, it will bring up the correspondent dialog with ability to rename & merge & delete & add tags.
    - Zotero database will save the changes you made to tags & items. 
    - TODO: Add a non-existing tag to items
    - KNOWN ISSUE: Batch Edit for group libraries is currently buggy. Proceed with caution. 


	
- ZotCustom:
	- Gives the user an option to create their own custom citation format when making a new bibliography.
	- WIP
- ZotCustom_fields:
	-Allows users to create their own forms with their own custom fields.
