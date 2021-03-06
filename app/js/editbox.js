/**
 * Last Change: 2014 Jan 14, 13:01
 * TODO: autocomplete
 */


if(typeof vicmd === 'undefined')
    vicmd = {};


/*{{{ EditBox */
vicmd.EditBox = function(options) {

    options = $.extend({
        element: 'div',
        class: 'editbox',
        lines: 1,
        cols: 255
    }, options);

    var self = document.createElement(options.element);
    var $self = $(self);

    $self.addClass(options.class);

    self.area = new vicmd.EditBox.TextArea({
        lines: options.lines,
        cols: options.cols,
        box: self
    });

    self.cursor = new vicmd.EditBox.Cursor(self);

    self.appendChild(self.area);
    self.appendChild(self.cursor);

    self.text = function(text) {
        return self.area.text(text);
    };

    self.putText = function(text) {
        self.area.putText(text);
    };

    self.backspace = function() {
        self.area.backspace();
    };

    self.del = function() {
        self.area.del();
    };

    self.backword = function() {
        self.area.backword();
    };

    return self;
    
};
/* EditBox }}}*/

/*{{{ TextArea */
vicmd.EditBox.TextArea = function(options) {

    var self = document.createElement('div');
    var $self = $(self);
    var box = options.box;

    $self.addClass('textarea');
    for(var i = 0; i < options.lines; i++)
        self.appendChild(new vicmd.EditBox.Line({cols: options.cols}));

    self.getLine = function(index) {
        return index in _lines() ? _lines()[index] : false;
    };

    self.currentLine = function() {
        if(box.cursor.pos().y in _lines())
            return _lines()[box.cursor.pos().y];
        else return new vicmd.EditBox.Line({
            cols: options.cols,
            text: ''
        });
    };

    self.text = function(text) {
        if(typeof text === 'string') {
            var lns = _lines();
            var text_ = text.split('\n');
            $self.empty();
            box.cursor.moveTo(0, 0);
            for(var l in text_) {
                self.appendChild(new vicmd.EditBox.Line({
                    cols: options.cols,
                    text: text_[l]
                }));
            }
            box.cursor.moveToLastLine();
            box.cursor.moveToLineEnd();
        }
        else
            return _lines().join('\n');
    };

    self.linesCount = function() {
        return self.getElementsByTagName('pre').length;
    };

    self.putText = function(text) {
        var lines = _lines();
        var text_ = text.split('\n');
        var firstline = text_.shift();
        var curline = self.currentLine();
        var after = curline.getTextAfter(box.cursor.pos().x);
        curline.setText(curline.getTextBefore(box.cursor.pos().x) + firstline);
        box.cursor.moveX(firstline.length);
        for(var l in text_) {
            $(new vicmd.EditBox.Line({
                cols: options.cols,
                text: text_[l]
            })).insertAfter(self.currentLine());
            box.cursor.moveY(1);
        }
        self.currentLine().setText(self.currentLine().getText() + after);
    };

    self.backspace = function() {
        var curline = self.currentLine();
        var before = curline.getTextBefore(box.cursor.pos().x);
        var after = curline.getTextAfter(box.cursor.pos().x);
        if(before.length) {
            before = before.substr(0, before.length - 1);
            curline.setText(before + after);
            box.cursor.moveX(-1);
        }
        else if(box.cursor.pos().y) {
            curline.remove();
            box.cursor.moveY(-1);
            curline = self.currentLine();
            box.cursor.moveToLineEnd();
            curline.setText(curline.getText() + after);
        }
    };

    self.del = function() {
        var curline = self.currentLine();
        var before = curline.getTextBefore(box.cursor.pos().x);
        var after = curline.getTextAfter(box.cursor.pos().x);
        if(after.length) {
            after = after.substr(1);
            curline.setText(before + after);
        }
        else if(box.cursor.pos().y < self.linesCount() - 1) {
            var nextline = self.getLine(box.cursor.pos().y + 1);
            curline.setText(before + nextline.getText());
            nextline.remove();
        }
    };

    self.backword = function() {
        var curline = self.currentLine();
        var before = curline.getTextBefore(box.cursor.pos().x);
        var after = curline.getTextAfter(box.cursor.pos().x);
        if(before.length) {
            before = before.replace(/[\s\t]+$/, '').replace(/[a-zA-Zа-яА-ЯёЁ0-9]+$|[^a-zA-Zа-яА-ЯёЁ0-9]$/, '');
            curline.setText(before + after);
            box.cursor.moveTo(before.length, -1);
        }
        else if(box.cursor.pos().y) {
            curline.remove();
            box.cursor.moveY(-1);
            curline = self.currentLine();
            box.cursor.moveToLineEnd();
            curline.setText(curline.getText() + after);
        }
    };

    function _lines() {
        return Array.prototype.slice.call(self.getElementsByTagName('pre'));
    }
    
    return self;
    
};
/* TextArea }}}*/

/*{{{ Line */
vicmd.EditBox.Line = function(options) {

    options = $.extend({
        cols: 80,
        text: ''
    }, options);

    var self = document.createElement('pre');
    var $self = $(self);
    var box = options.box;

    $self.addClass('line');
    self.innerText = options.text;

    self.setText = function(text) {
        self.innerText = text;
    };

    self.getText = function() {
        return self.innerText;
    };

    self.len = function() {
        return self.innerText.length;
    };

    self.getTextBefore = function(pos) {
        return self.innerText.split('').slice(0, pos).join('');
    };

    self.getTextAfter = function(pos) {
        return self.innerText.split('').slice(pos).join('');
    };

    self.toString = function() {
        return self.innerText;
    };

    return self;
    
};
/* Line }}}*/

/*{{{ Cursor */
vicmd.EditBox.Cursor = function(box) {

    var self = document.createElement('div');
    var $self = $(self);
    var pos = {
        x: 0,
        y: 0
    };
    var blink = {
        interval: 0,
        timeout: 0,
        timeout_main: 0
    };

    $self.addClass('cursor');

    self.type = 'block';

    $self.addClass(self.type);
    
    self.pos = function() {
        return pos;
    };

    self.move = function(x, y) {
        if(!moveX(x) && !moveY(y)) return;
        blinkStop();
        self.refresh();
        blinkStart();
    }

    self.moveX = function(amt) {
        if(!moveX(amt)) return;
        blinkStop();
        self.refresh();
        blinkStart();
    };

    self.moveY = function(amt) {
        if(!moveY(amt)) return;
        blinkStop();
        self.refresh();
        blinkStart();
    };

    self.moveTo = function(x, y) {
        if(x >= 0 && x <= box.area.currentLine().len())
            pos.x = x;
        if(y >= 0 && y < box.area.linesCount())
            pos.y = y;
        blinkStop();
        self.refresh();
        blinkStart();
    };

    self.moveToLastLine = function() {
        pos.y = box.area.linesCount() - 1;
        blinkStop();
        self.refresh();
        blinkStart();
    }

    self.moveToLineEnd = function() {
        pos.x = box.area.currentLine().len();
        blinkStop();
        self.refresh();
        blinkStart();
    };

    self.normalize = function() {
        // TODO: implement
    };

    self.refresh = function() {
        $self.css('left', (pos.x * 7) + 'px');
        $self.css('top', (pos.y * 15) + 'px');
    };

    self.show = function() {
        $self.addClass('visible');
    };

    self.hide = function() {
        $self.removeClass('visible');
    };

    self.isHidden = function() {
        return !$self.hasClass('visible');
    };

    self.toggle = function() {
        if(self.isHidden()) {
            self.show();
            self.refresh();
            blinkStart();
        }
        else {
            blinkStop();
            self.hide();
        }
    };

    self.setType = function(type) {
        blinkStop();
        $self.removeClass(self.type);
        $self.addClass(type);
        self.type = type;
        self.refresh();
        blinkStart();
    };

    function moveX(amt) {
        var newx = pos.x + amt;
        if(newx < 0 || newx > box.area.currentLine().len()) return false;
        pos.x = newx;
        return true;
    }

    function moveY(amt) {
        var newy = pos.y + amt;
        if(newy < 0 || newy >= box.area.linesCount()) return false;
        pos.y = newy;
        if(pos.x > box.area.currentLine().len())
            pos.x = box.area.currentLine().len();
        return true;
    }

    function blinkStart() {
        blink.timeout_main = setTimeout(function() {
            blink.interval = setInterval(blinkStep, 1000);
            blinkStep();
        }, 500);
    };

    function blinkStop() {
        clearInterval(blink.interval);
        clearTimeout(blink.timeout);
        clearTimeout(blink.timeout_main);
        $self.css('opacity', 1);
    };

    function blinkStep() {
        $self.animate({
            opacity: 0
        }, 150, 'linear', function() {
            blink.timeout = setTimeout(function() {
                $self.animate({ opacity: 1 }, 150, 'linear');
            }, 350);
        });
    }

    blinkStart();

    return self;

};
/* Cursor }}}*/


// vim:foldmethod=marker
