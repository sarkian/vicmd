/**
 * Last Change: 2013 Nov 19, 14:14
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


vicmd.PathBox = function(placeholder) {

    var self = new vicmd.EditBox();
    var $self = $(self);

    $self.addClass('pathbox');
    placeholder.replaceWith(self);

    self.setPath = function(path) {
        self.innerText = path;
    };

    self.setFocus = function(focus) {
        if(focus)
            $self.addClass('focus');
        else
            $self.removeClass('focus');
    };

    return self;
    
};
