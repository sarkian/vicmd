if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.Panes = function(container) {
    this.__init__(container);
};

vicmd.Panes.prototype = {

    _container: null,
    _current: 'left',

    left: null,
    right: null,

    __init__: function(container) {
        this._container = $(container);
        var panes = this._container.find('.pane');
        this.left = new vicmd.Pane(panes.get(0));
        this.right = new vicmd.Pane(panes.get(1));

    },

    current: function() {
        return this[this._current];
    },

    change: function() {
        this.current().setFocus(false);
        this._current = this._current === 'left' ? 'right' : 'left';
        this.current().setFocus(true);
    },

    selectLeft: function() {
        this._current = 'left';
        this.right.setFocus(false);
        this.left.setFocus(true);
    },

    selectRight: function() {
        this._current = 'right';
        this.left.setFocus(false);
        this.right.setFocus(true);
    },

    keydown: function(e) {
        if(e.keyCode == 9)
            this.change();
        else
            this.current().keydown(e);
        return false;
    }

};
