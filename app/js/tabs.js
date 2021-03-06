if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.Tabs = function(container) {
    this.__init__(container);
};

vicmd.Tabs.prototype = {

    _tabbar: null,
    pathbox: null,
    _tabfiles: null,
    _tabs: [],
    _current: 0,

    __init__: function(container) {
        this._tabbar = container.find('.tabbar');
        this.pathbox = new vicmd.PathBox(container.find('.pathbox'));
        this._tabfiles = container.find('.tabfiles');
        this._tabs = [];
    },

    setFocus: function(focus) {
        this.pathbox.setFocus(focus);
    },

    current: function() {
        return this._tabs[this._current];
    },

    first: function() {
        return this._tabs[0];
    },

    last: function() {
        return this._tabs[this._tabs.length - 1];
    },

    selectPrev: function() {
        this.select(this.getPrevIndex());
    },

    selectNext: function() {
        this.select(this.getNextIndex());
    },

    select: function(index) {
        if(index in this._tabs) {
            this._tabs[index].select();
            this._current = index;
        }
    },

    getPrevIndex: function() {
        var i = this._current;
        return i < 1 ? this._tabs.length - 1 : i - 1;
    },

    getNextIndex: function() {
        var i = this._current;
        return i >= this._tabs.length - 1 ? 0 : i + 1;
    },

    open: function(path, show_hidden) {
        var tab = new vicmd.Tab(this, path, show_hidden);
        this._tabs.push(tab);
        tab._index = this._tabs.length - 1;
        return tab._index;
    },

    closeCurrent: function() {
        if(this._tabs.length < 2)
            return;
        var to_close = this._current;
        if(to_close - 1 in this._tabs)
            this.select(to_close - 1);
        else
            this.select(to_close + 1);
        this.close(to_close);
    },

    close: function(index) {
        this._tabs[index].close();
        this._tabs.splice(index, 1);
        for(var i in this._tabs)
            this._tabs[i]._index = i;
    },

    saveState: function() {
        var tabs = [];
        for(var t in this._tabs) {
            tabs.push(this._tabs[t].saveState());
        }
        return tabs;
    }

};
