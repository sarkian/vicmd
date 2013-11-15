if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.Tab = function(tabs, path) {
    this.__init__(tabs, path);
};

vicmd.Tab.prototype = {

    _tabs: null,
    _path: null,
    _tabbar_item: null,
    _index: 0,

    files: null,
    state: {
        show_hidden: false
    },

    __init__: function(tabs, path) {
        this._tabs = tabs;
        this._path = path;
        this._setTabbarItem();
        this.files = new vicmd.Files(this);
        this.setPath(path);
        this.files.refresh();
        this.files.select(0);
    },

    setPath: function(path) {
        if(this.files.setPath(path)) {
            this._path = path;
            if(path.length > 20)
                var tabpath = '..' + path.replace(/(.*)(.{18}$)/, '$2');
            else
                var tabpath = path;
            this._tabbar_item.text(path);
            this._tabs._pathbox.setPath(path);
            this.files.select(0);
        } 
    },

    select: function() {
        this.files.focus();
        this._tabs._tabbar.find('.tab').removeClass('active');
        this._tabbar_item.addClass('active');
        this._tabs._pathbox.setPath(this._path);
    },

    close: function() {
        this._tabbar_item.remove();
        $(this.files).remove();
    },

    _setTabbarItem: function() {
        this._tabbar_item = $('<div>', {
            class: 'tab'
        });
        this._tabs._tabbar.append(this._tabbar_item);
    },

};
