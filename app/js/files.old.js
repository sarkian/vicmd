if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.Files = function(tab) {
    this.__init__(tab);
};

vicmd.Files.prototype = {

    _tab: null,
    _files: [],
    _container: null,
    _current: 0,

    __init__: function(tab) {
        this._tab = tab;
        this._path = tab._path;
        this._setContainer();
    },

    setPath: function(path) {
        this._path = path;
    },

    current: function() {
        return this._files[this._current];
    },

    prev: function() {
        var i = this._current;
        i = i < 1 ? this._files.length - 1 : i - 1;
        return this._files[i];
    },

    next: function() {
        var i = this._current;
        i = i >= this._files.length - 1 ? 0 : i + 1;
        return this._files[i];
    },

    select: function() {
        this._tab._tabs._tabfiles.find('.tabfiles-item.active').removeClass('active');
        this._container.addClass('active');
    },

    refresh: function() {
        this._container.empty();
        this._files = [];
        var files_ = vicmd_ui.readdir(this._path);
        var self = this;
        var dirs = [];
        var files = [];
        files_.forEach(function(data) {
            var node = new vicmd.File(self, data);
            self._files.push(node);
            // if(node.isDot())
                // node.setVisible(false);
            if(node.isDir())
                dirs.push(node._item);
            else
                files.push(node._item);
        });
        self._container.append(dirs);
        self._container.append(files);
        this._container.mCustomScrollbar({
            theme: 'light-2'
        });
    },

    _setContainer: function() {
        this._container = $('<div>', {
            class: 'tabfiles-item'
        });
        this._tab._tabs._tabfiles.append(this._container);
    }

};
