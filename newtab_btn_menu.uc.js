/* Firefox userChrome script
 * Open URL in clipboard by right-clicking new-tab-button then use context menu
 * Tested on Firefox 140
 * Author: garywill (https://garywill.github.io)
 */

// ==UserScript==
// @include         main
// ==/UserScript==

console.log("newtab_btn_menu.js");

(() => {

    const new_tab_url_label = 'New tab open: ';
    var btn_newtab_w_url_clipboard_str = "";

    function _readFromClipboard() {
        var url;

        try {
            // Create transferable that will transfer the text.
            var trans = Cc["@mozilla.org/widget/transferable;1"].createInstance(
                Ci.nsITransferable
            );
            trans.init(window.docShell.QueryInterface(Ci.nsILoadContext));

            trans.addDataFlavor("text/plain");


            let clipboard = Services.clipboard;
            if (false) {
                clipboard.getData(trans, clipboard.kSelectionClipboard);
            } else {
                clipboard.getData(trans, clipboard.kGlobalClipboard);
            }

            var data = {};
            trans.getTransferData("text/plain", data);

            if (data) {
                data = data.value.QueryInterface(Ci.nsISupportsString);
                url = data.data;
            }
        } catch (ex) {}

        return url;
    }

    function btn_newtab_w_url_click()
    {
        gBrowser.loadTabs([btn_newtab_w_url_clipboard_str] , {
            inBackground: false,
            relatedToCurrent: false,
            triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({}) //FF63
        });
    }
    function newtabbtnContextMenu_onpopupshowing(event)
    {
        btn_newtab_w_url_clipboard_str = _readFromClipboard();
        if (document.getElementById("btn_newtab_w_url"))
        {
            document.getElementById("btn_newtab_w_url").setAttribute("label", new_tab_url_label + btn_newtab_w_url_clipboard_str);
            document.getElementById("btn_newtab_w_url").setAttribute("tooltiptext", new_tab_url_label + btn_newtab_w_url_clipboard_str);
        }
        if (document.getElementById("btn_newtab_w_url_2"))
        {
            document.getElementById("btn_newtab_w_url_2").setAttribute("label", new_tab_url_label + btn_newtab_w_url_clipboard_str);
            document.getElementById("btn_newtab_w_url_2").setAttribute("tooltiptext", new_tab_url_label + btn_newtab_w_url_clipboard_str);
        }

    }

    // ----------------------------------

    // create new popup menu
    let newtabbtnContextMenu = document.createXULElement("menupopup");
    newtabbtnContextMenu.id = "newtabbtnContextMenu";
    newtabbtnContextMenu.addEventListener("popupshowing",newtabbtnContextMenu_onpopupshowing);

    // new popup menu's 1st item: New Tab
    let btn_newtab = document.createXULElement("menuitem");
    btn_newtab.setAttribute("label", 'New Tab');
    btn_newtab.addEventListener("command", function() {BrowserCommands.openTab();} );

    newtabbtnContextMenu.appendChild(btn_newtab);

    // new popup menu's 2nd item: New Tab with clipboard
    let btn_newtab_w_url = document.createXULElement("menuitem");
    btn_newtab_w_url.id = "btn_newtab_w_url";
    btn_newtab_w_url.setAttribute("label", new_tab_url_label);
    btn_newtab_w_url.addEventListener("command", btn_newtab_w_url_click);

    newtabbtnContextMenu.appendChild(btn_newtab_w_url);


    document.getElementById("mainPopupSet").appendChild(newtabbtnContextMenu);

    // ----------------------------------
    
    // Add created popup menu to two new tab buttons (different button is displayed, depending on user's customization)
    const tabs_newtab_button = document.getElementById("tabs-newtab-button");
    var observer1 = new MutationObserver(function(){
        observer1.disconnect();
        tabs_newtab_button.setAttribute("context","newtabbtnContextMenu");
    });
    observer1.observe(tabs_newtab_button,{attributes:true});
    
    
    const new_tab_button = document.getElementById("new-tab-button");
    var observer2 = new MutationObserver(function(){
        observer2.disconnect();
        new_tab_button.setAttribute("context","newtabbtnContextMenu");
    });
    observer2.observe(new_tab_button,{attributes:true});



})();
