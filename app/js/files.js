/**
 * Last Change: 2013 Nov 18, 21:24
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


vicmd.Files = function(tab) {

    var self = document.createElement('div');
    var selfjq = $(self);
    selfjq.addClass('tabfiles-item');
    var path = null;
    var current = null;
    var prev_name = null;

    tab._tabs._tabfiles.append(self);
    selfjq.mCustomScrollbar({
        theme: 'light-2',
        scrollInertia: 350,
        advanced: {
            updateOnBrowserResize: true,
            updateOnContentResize: true,
            autoScrollOnFocus: true,
            contentTouchScroll: false
        }
    });

    self.focus = function() {
        tab._tabs._tabfiles.find('.tabfiles-item.active').removeClass('active');
        selfjq.addClass('active');
    };

    self.setPath = function(newpath) {
        var data = backend.readdir(newpath);
        if(data.success) {
            self.refresh(data);
            path = newpath;
            current = null;
            return true;
        }
        else {
            alert(data.error);
            return false;
        }
    };

    self.refresh = function(filesdata) {
        container().empty();
        var filesdata = filesdata || backend.readdir(path);
        var files = [], dirs = [];
        filesdata.files.forEach(function(data) {
            var node = new vicmd.File(data);
            if(!tab.show_hidden && node.isHidden())
                node.setVisible(false);
            if(node.isDir())
                dirs.push(node);
            else
                files.push(node);
        });
        container().append(dirs);
        container().append(files);
    };

    self.hasSelected = function() {
        return current == null ? false : true;
    };

    self.select = function(index) {
        var files = selfjq.find('.file-item.visible');
        var file = files.get(index);
        if(file) {
            file.select();
            current = file;
        }
    };

    self.selectPrev = function() {
        var files = $(current).prevAll('.visible');
        if(files.length) {
            var file = files.get(0);
            file.select();
            current = file;
        }
    };

    self.selectNext = function() {
        var files = $(current).nextAll('.visible');
        if(files.length) {
            var file = files.get(0);
            file.select();
            current = file;
        }
    };

    self.selectFirst = function() {
        var file = selfjq.find('.file-item.visible').first().get(0);
        file.select();
        current = file;
    };

    self.selectLast = function() {
        var file = selfjq.find('.file-item.visible').last().get(0);
        file.select();
        current = file;
    };

    self.selectOnTop = function() {
        var scrollpos = Math.abs(parseInt(container().get(0).style.top));
        var index = parseInt(scrollpos / 15) + 3;
        var file = container().find('.file-item.visible').get(index);
        if(file)
            file.select();
    };

    self.selectOnMiddle = function() {
        // TODO: implement
    };

    self.selectOnBottom = function() {
        // TODO: implement
    };

    self.selectByName = function(name) {
        var files = selfjq.find('.file-item.visible:contains(' + name + ')');
        var file = files.get(0);
        if(file)
            file.select();
        else
            self.select(0);
    };

    self.search = function(query) {
        query = query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        console.log(query);
        var files = selfjq.find('.file-item.visible').toArray();
        var expr = new RegExp('^' + query, 'gi');
        for(var f in files) {
            var file = files[f];
            if(expr.test(file.data.name)) {
                file.select();
                return;
            }
            
        }
    };

    self.scrollUp = function(c) {
        c = c || 1;
        var pos = Math.abs(parseInt(container().get(0).style.top));
        selfjq.mCustomScrollbar('scrollTo', pos - parseInt(selfjq.height() / 2.5) * c);
    };

    self.scrollDown = function(c) {
        c = c || 1;
        var pos = Math.abs(parseInt(container().get(0).style.top));
        selfjq.mCustomScrollbar('scrollTo', pos + parseInt(selfjq.height() / 2.5) * c);
    };

    self.openParent = function() {
        var parent_name = current.data.parent_name;
        selfjq.find('.file-item.visible').first().get(0).open();
        var files = selfjq.find('.file-item.visible:contains(' + parent_name + ')');
        var file = files.get(0);
        if(file)
            file.select();
    };

    self.openCurrent = function() {
        var file = self.current();
        file.open();
    };

    self.toggleHidden = function() {
        var visible;
        if(tab.show_hidden) {
            tab.show_hidden = false;
            visible = false;
        }
        else {
            tab.show_hidden = true;
            visible = true;
        }
        container().find('._hidden').each(function(item) {
            this.setVisible(visible);
        });
        if(!visible && current.isHidden())
            self.selectNext();
    };

    self.current = function() {
        return current;
    };

    self.getTab = function() {
        return tab;
    };

    self._setCurrent = function(newcurrent) {
        current = newcurrent;
    };

    function container() {
        return selfjq.find('.mCSB_container');
    }

    return self;

};

vicmd.Files.prototype = {};

window._s = function() {
    ui.panes.left.tabs.current().files.search();
}

