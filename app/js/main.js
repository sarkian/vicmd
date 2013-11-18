/**
 * Last Change: 2013 Nov 18, 19:55
 */

window.addEventListener('DOMContentLoaded', function() {

    window.ui = new vicmd.UI('#main');
    backend.ready();
    for(var t in ui.panes.left.tabs._tabs)
        ui.panes.left.tabs._tabs[t].files.current().select();
    // ui.saveState();

});
