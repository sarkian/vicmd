if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.PathBox = function(input) {

    this.__init__(input);

    input.bind('keydown', function(e) {
        if(e.ctrlKey) {
            switch(e.keyCode) {
                case 69:
                    processCtrlE(e);
                    break;
                case 76:
                    processCtrlL(e);
                    break;
                case 72:
                    processCtrlH(e);
                    break;
                case 87:
                    processCtrlW(e);
                    break;
            }
        }
        else {
            switch(e.keyCode) {
                case 13:
                    processCr(e);
                    return false;
                    break;
            }
        }
        // return false;
    });

    function processCtrlE(e) {
        var pos = e.target.selectionStart - 1;
        e.target.setSelectionRange(pos, pos);
    }

    function processCtrlL(e) {
        var pos = e.target.selectionStart + 1;
        e.target.setSelectionRange(pos, pos);
    }

    function processCtrlH(e) {
        e.target.value = e.target.value.replace(/.$/, '');
    }

    function processCtrlW(e) {
        var val = e.target.value;
        val = val.replace(/[\s\t]+$/, '');
        e.target.value =
            val.replace(/[a-zA-Zа-яА-ЯёЁ0-9]+$|[^a-zA-Zа-яА-ЯёЁ0-9]$/, '');
    }

    function processCr(e) {
        e.target.disabled = 'disabled';
        e.target.blur();
        ui.panes.current().tabs.current().setPath(e.target.value);
        ui.kbd.setMode('normal');
    }

};

vicmd.PathBox.prototype = {

    _input: null,
    
    __init__: function(input) {
        this._input = input;
    },

    setPath: function(path) {
        this._input.val(path);
    },

    setFocus: function(focus) {
        if(focus)
            this._input.addClass('focus');
        else
            this._input.removeClass('focus');
    },

    edit: function() {
        this._input.removeAttr('disabled');
        this._input.focus();
    }

};

