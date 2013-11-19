/**
 * Last Change: 2013 Nov 19, 16:03
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


vicmd.CmdLine = function(line) {

    // var self = document.createElement('pre');
    var self = new vicmd.EditBox();
    var $self = $(self);
    var $line = $(line);

    $self.addClass('cmdline');
    line.appendChild(self);

    

    return self;
    
};
