/**
 * Last Change: 2013 Nov 18, 21:01
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


vicmd.CmdLine = function(line) {

    var self = document.createElement('pre');
    var $self = $(self);
    var $line = $(line);

    $self.addClass('cmdline');
    line.appendChild(self);

    self.putChar = function(char) {
        self.innerText += char;
    };

    self.backspace = function() {
        self.innerText = self.innerText.replace(/.$/, '');
    };

    self.backword = function() {
        var val = self.innerText;
        val = val.replace(/[\s\t]+$/, '');
        self.innerText = val.replace(/[a-zA-Zа-яА-ЯёЁ0-9]+$|[^a-zA-Zа-яА-ЯёЁ0-9]$/, '');
    };

    self.text = function(text) {
        if(typeof text === 'string')
            self.innerText = text;
        else
            return self.innerText;
    };

    return self;
    
};
