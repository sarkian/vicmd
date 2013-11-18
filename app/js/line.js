/**
 * Last Change: 2013 Nov 18, 20:30
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


vicmd.Line = function(wrapper) {

    var self = document.createElement('div');
    var $self = $(self);
    var $wrapper = $(wrapper);

    $self.addClass('line');
    wrapper.appendChild(self);

    self.mode_ind = new vicmd.ModeInd(self);
    self.cmdline = new vicmd.CmdLine(self);


    return self;
    
};
