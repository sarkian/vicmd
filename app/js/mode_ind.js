/**
 * Last Change: 2013 Nov 18, 19:07
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


vicmd.ModeInd = function(line) {

    var self = document.createElement('div');
    var $self = $(self);
    var $line = $(line);
    var current_mode = null;

    $self.addClass('mode-ind normal');
    line.appendChild(self);


    self.setMode = function(mode) {
        $self.removeClass(current_mode);
        $self.addClass(mode);
        $self.text(mode.toUpperCase());
        current_mode = mode;
    };


    return self;
    
};
