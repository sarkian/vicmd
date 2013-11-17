/**
 * Last Change: 2013 Nov 18, 00:39
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


vicmd.Tasks = function(wrapper) {

    var self = document.createElement('div');
    var $self = $(self);
    var $wrapper = $(wrapper);
    $self.addClass('tasks');
    wrapper.appendChild(self);

    var visible = false;

    self.toggle = function() {
        if(visible)
            self.hide();
        else
            self.show();
    };

    self.show = function() {
        var height = parseInt($(document).height() / 3);
        $wrapper.parent().animate({
            'height': height + 'px'
        }, 300, function() {
            $('.tabfiles-item').mCustomScrollbar('update');
            ui.panes.current().tabs.current().files.current().select();
        });
        visible = true;
    };

    self.hide = function() {
        $wrapper.parent().animate({
            'height': '0px'
        }, 300, function() {
            $('.tabfiles-item').mCustomScrollbar('update');
            ui.panes.current().tabs.current().files.current().select();
        });
        visible = false;
    };

    return self;

};

vicmd.Tasks.prototype = {};
