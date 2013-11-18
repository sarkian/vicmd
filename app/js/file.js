/**
 * Last Change: 2013 Nov 18, 12:24
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


vicmd.File = function(data) {

    var self = document.createElement('div');
    self.innerText = data.name;
    self.data = data;
    var selfjq = $(self);
    selfjq.attr('class', 'file-item visible ' + data.type);
    selfjq.data('name', data.name);

    self.isDir = function() {
        return data.type === 'dir';
    };

    self.isHidden = function() {
        return data.name !== '..' && /^\./.test(data.name);
    };

    self.setVisible = function(visible) {
        if(visible) {
            selfjq.removeClass('hidden');
            selfjq.addClass('visible');
        }
        else {
            selfjq.addClass('hidden');
            selfjq.removeClass('visible');
        }
    };

    self.select = function() {
        selfjq.parent().find('.file-item').removeClass('active');
        selfjq.addClass('active');
        parent()._setCurrent(this);
        parent().getTab().historySet(this.data.name);
        var height = parentjq().height();
        var filepos = selfjq.position().top;
        var scrollpos = Math.abs(parseInt(parentjq().find('.mCSB_container').get(0).style.top));
        var pos = filepos - scrollpos;
        if(pos > height - 60)
            scroll(filepos - height + 60);
        if(pos < 45)
            scroll(filepos - 45);
    };

    self.open = function() {
        if(self.isDir())
            parent().getTab().setPath(data.path);
    };

    function parent() {
        return self.parentNode.parentNode.parentNode;
    }

    function parentjq() {
        return selfjq.parent().parent().parent();
    }

    function scroll(pos) {
        parentjq().mCustomScrollbar('scrollTo', pos);
    }

    if(self.isHidden())
        selfjq.addClass('_hidden');

    return self;

};
