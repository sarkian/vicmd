if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.UI = function(container) {

    this.__init__(container);

    var self = this;

    this.kbd = new vicmd.Kbd();

    this.kbd.map('<Tab>', function() {
        self.panes.change();
    });

    this.kbd.map('<C-w>h', function() {
        self.panes.selectLeft();
    });

    this.kbd.map('<C-w>l', function() {
        self.panes.selectRight();
    });

    this.kbd.map('<C-h>', function() {
        self.panes.current().tabs.selectPrev();
    });

    this.kbd.map('<C-l>', function() {
        self.panes.current().tabs.selectNext();
    });
    
    this.kbd.map('<count>k', function(c) {
        for(var i = 0; i < c; i++)
            self.panes.current().tabs.current().files.selectPrev();
    });

    this.kbd.map('<count>j', function(c) {
        for(var i = 0; i < c; i++)
            self.panes.current().tabs.current().files.selectNext();
    });

    this.kbd.map('T', function() {
        self.panes.current().tabs.current().files.selectOnTop();
    });

    this.kbd.map('M', function() {
        self.panes.current().tabs.current().files.selectOnMiddle();
    });

    this.kbd.map('B', function() {
        self.panes.current().tabs.current().files.selectOnBottom();
    });

    this.kbd.map('<count><C-k>', function(c) {
        self.panes.current().tabs.current().files.scrollUp(c);
    });

    this.kbd.map('<count><C-j>', function(c) {
        self.panes.current().tabs.current().files.scrollDown(c);
    });

    this.kbd.map('gg', function() {
        self.panes.current().tabs.current().files.selectFirst();
    });

    this.kbd.map('G', function() {
        self.panes.current().tabs.current().files.selectLast();
    });

    this.kbd.map('h', function() {
        self.panes.current().tabs.current().files.openParent();
    });

    this.kbd.map('l', function() {
        self.panes.current().tabs.current().files.openCurrent();
    });
    this.kbd.map('<Cr>', function() {
        self.panes.current().tabs.current().files.openCurrent();
    });

    this.kbd.map('tt', function() {
        var i = self.panes.current().tabs.open(
            self.panes.current().tabs.current()._path
        );
        self.panes.current().tabs.select(i);
    });

    this.kbd.map('tw', function() {
        self.panes.current().tabs.closeCurrent();
    });

    this.kbd.map('I', function() {
        self.panes.current().tabs.current().files.toggleHidden();
    });

};

vicmd.UI.prototype = {

    _container: null,
    _current: null,

    panes: null,

    __init__: function(container) {
        this._container = $(container);
        this.panes = new vicmd.Panes(this._container.find('.panes'));
        this._current = 'panes';
    },

    current: function() {
        return this[this._current];
    }

};
