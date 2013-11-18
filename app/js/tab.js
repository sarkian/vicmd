if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.Tab = function(tabs, path, show_hidden) {
    this.__init__(tabs, path, show_hidden);
};

vicmd.Tab.prototype = {

    _tabs: null,
    _path: null,
    _tabbar_item: null,
    _index: 0,
    _history: {},

    files: null,
    show_hidden: false,

    __init__: function(tabs, path, show_hidden) {
        this._tabs = tabs;
        this._path = path;
        this.show_hidden = typeof show_hidden === 'boolean' ? show_hidden : false;
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
            if(this._path in this._history)
                this.files.selectByName(this._history[this._path]);
            else
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

    historyAdd: function(path, name) {
        this._history[path] = name;
    },

    historySet: function(name) {
        this._history[this._path] = name;
    },

    saveState: function() {
        return {
            path: this._path,
            show_hidden: this.show_hidden,
            history: this._history,
            selected: this.files.current().data.name
        };
    },

    _setTabbarItem: function() {
        this._tabbar_item = $('<div>', {
            class: 'tab'
        });
        this._tabs._tabbar.append(this._tabbar_item);
    },

};
