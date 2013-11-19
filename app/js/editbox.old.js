/**
 * Last Change: 2013 Nov 19, 18:18
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


/*{{{ EditBox */
vicmd.EditBox = function(options) {

    options = $.extend({
        element: 'div',
        class: 'editbox',
        lines: 1,
        cols: 1
    }, options);

    var self = document.createElement(options.element);
    var $self = $(self);
    var pre = document.createElement('pre');

    self.appendChild(pre);
    $self.addClass(options.class);

    self.putChar = function(char) {
        pre.innerText += char;
    };

    self.backspace = function() {
        pre.innerText = pre.innerText.replace(/.$/, '');
    };

    self.backword = function() {
        var val = pre.innerText;
        val = val.replace(/[\s\t]+$/, '');
        pre.innerText = val.replace(/[a-zA-Zа-яА-ЯёЁ0-9]+$|[^a-zA-Zа-яА-ЯёЁ0-9]$/, '');
    };

    self.text = function(text) {
        if(typeof text === 'string')
            pre.innerText = text;
        else
            return pre.innerText;
    }

    return self;
    
};
/* EditBox }}}*/

/*{{{ TextArea */
vicmd.EditBox.TextArea = function(lines) {

    lines = lines || 1;

    var self = document.createElement('div');
    var $self = $(self);
    var lines = [];

    self.get = function(index) {
        return index in lines ? lines[index] : false;
    };
    
    return self;
    
};
/* TextArea }}}*/

/*{{{ Line */
vicmd.EditBox.Line = function(cols) {

    var self = document.createElement('pre');
    var $self = $(self);

    self.toString = function() {
        return self.innerText;
    };

    return self;
    
};
/* Line }}}*/


// vim:foldmethod=marker
