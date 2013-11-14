/**
 * Last Change: 2013 Nov 14, 18:21
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
        var data = vicmd_ui.readdir(newpath);
        console.log(data);
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
        var filesdata = filesdata || vicmd_ui.readdir(path);
        var files = [], dirs = [];
        filesdata.files.forEach(function(data) {
            var node = new vicmd.File(data);
            if(node.isHidden())
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

    self.scrollUp = function() {
        var pos = Math.abs(parseInt(container().get(0).style.top));
        selfjq.mCustomScrollbar('scrollTo', pos - 300);
    };

    self.scrollDown = function() {
        var pos = Math.abs(parseInt(container().get(0).style.top));
        selfjq.mCustomScrollbar('scrollTo', pos + 300);
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



