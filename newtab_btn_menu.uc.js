/* Firefox userChrome script
 * Open URL in clipboard by right-clicking new-tab-button then use context menu
 * Tested on Firefox 78
 * Author: garywill (https://github.com/garywill)
 */

console.log("newtab_btn_menu.js");

const new_tab_url_label = 'New tab open: ';
var btn_newtab_w_url_clipboard_str = "";
function btn_newtab_click()
{
    BrowserOpenTab();
}
function btn_newtab_w_url_click()
{
    gBrowser.loadOneTab(btn_newtab_w_url_clipboard_str, {
        inBackground: false,
        relatedToCurrent: false,
        triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({}) //FF63
    });
}
function newtabbtnContextMenu_onpopupshowing()
{
    btn_newtab_w_url_clipboard_str = readFromClipboard();
    document.getElementById("btn_newtab_w_url").setAttribute("label", new_tab_url_label + btn_newtab_w_url_clipboard_str);
    document.getElementById("btn_newtab_w_url").setAttribute("tooltiptext", new_tab_url_label + btn_newtab_w_url_clipboard_str);
}

(() => {
    
    var newtabbtnContextMenu = document.createXULElement("menupopup");
    newtabbtnContextMenu.id = "newtabbtnContextMenu";
    newtabbtnContextMenu.setAttribute("onpopupshowing","newtabbtnContextMenu_onpopupshowing()");

    //newtabbtnContextMenu.appendChild(document.createXULElement("menuseparator"));


    var btn_newtab = document.createXULElement("menuitem");
    btn_newtab.setAttribute("label", 'New tab');
    btn_newtab.setAttribute("oncommand", "btn_newtab_click()");

    newtabbtnContextMenu.appendChild(btn_newtab);


    var btn_newtab_w_url = document.createXULElement("menuitem");
    btn_newtab_w_url.id = "btn_newtab_w_url";
    btn_newtab_w_url.setAttribute("label", new_tab_url_label);
    btn_newtab_w_url.setAttribute("oncommand", "btn_newtab_w_url_click()");

    newtabbtnContextMenu.appendChild(btn_newtab_w_url);


    document.getElementById("mainPopupSet").appendChild(newtabbtnContextMenu);

    
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
