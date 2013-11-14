if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.File = function(files, data) {
    this.__init__(files, data);
};

vicmd.File.prototype = {

    _files: null,
    _data: null,
    _item: null,
    _index: 0,

    __init__: function(files, data) {
        this._files = files;
        this._data = data;
        this._addItem();
    },

    isDir: function() {
        return this._data.type === 'dir';
    },

    isDot: function() {
        return this._data.name !== '..' && /^\./.test(this._data.name);
    },

    append: function() {
        this._files._container.append(this._item);
    },

    setVisible: function(visible) {
        if(visible)
            this._item.removeClass('hide');
        else
            this._item.addClass('hide');
    },

    select: function() {
        this._files._container.find('.file-item').removeClass('active');
        this._item.addClass('active');
    },

    _addItem: function() {
        this._item = $('<div>', {
            class: 'file-item ' + this._data.type
        });
        this._item.text(this._data.name);
        var dirs = [], files = [];
    }

};
