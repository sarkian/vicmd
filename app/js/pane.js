if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.Pane = function(container) {
    this.__init__(container);
};

vicmd.Pane.prototype = {

    _container: null,

    tabs: null,

    __init__: function(container) {
        this._container = $(container);
        this.tabs = new vicmd.Tabs(this._container);
    },

    setFocus: function(focus) {
        $('.pane').removeClass('active');
        this._container.addClass('active');
        this.tabs.setFocus(focus);
    },

    keydown: function(e) {
        if(e.ctrlKey) {
            console.log(e.keyCode);
            switch(e.keyCode) {
                case 72:
                    this.tabs.prev().select();
                    break;
                case 76:
                    this.tabs.next().select();
                    break;
            }
        }
    }

};