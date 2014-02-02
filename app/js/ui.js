if(typeof vicmd === 'undefined')
    vicmd = {};

vicmd.UI = function(container) {

    this.__init__(container);

    var self = this;

    this.kbd = new vicmd.Kbd({
        onSetMode: function(oldmode, newmode) {
            self.line.mode_ind.setMode(newmode);
            self.line.cmdline.text('');
            switch(newmode) {
                case 'search':
                    self.line.cmdline.cursor.setType('line');
                    self.line.cmdline.cursor.show();
                    break;
                case 'normal':
                    self.line.cmdline.cursor.hide();
                    break;
            }
        }
    });

    this.kbd.map('<Tab>', function() {
        self.panes.change();
    }, ['normal', 'search']);

    this.kbd.map('<C-w>h', function() {
        self.panes.selectLeft();
    });

    this.kbd.map('<C-w>l', function() {
        self.panes.selectRight();
    });

    this.kbd.map('<C-h>', function() {
        self.panes.current().tabs.selectPrev();
    });

    this.kbd.map('<C-l>', function() {
        self.panes.current().tabs.selectNext();
    });
    
    this.kbd.map('<count>k', function(e, c) {
        for(var i = 0; i < c; i++)
            self.panes.current().tabs.current().files.selectPrev();
    });

    this.kbd.map('<count>j', function(e, c) {
        for(var i = 0; i < c; i++)
            self.panes.current().tabs.current().files.selectNext();
    });

    this.kbd.map('T', function() {
        self.panes.current().tabs.current().files.selectOnTop();
    });

    this.kbd.map('M', function() {
        self.panes.current().tabs.current().files.selectOnMiddle();
    });

    this.kbd.map('B', function() {
        self.panes.current().tabs.current().files.selectOnBottom();
    });

    this.kbd.map('<count><C-k>', function(e, c) {
        self.panes.current().tabs.current().files.scrollUp(c);
    });

    this.kbd.map('<count><C-j>', function(e, c) {
        self.panes.current().tabs.current().files.scrollDown(c);
    });

    this.kbd.map('gg', function() {
        self.panes.current().tabs.current().files.selectFirst();
    });

    this.kbd.map('G', function() {
        self.panes.current().tabs.current().files.selectLast();
    });

    this.kbd.map('h', function() {
        self.panes.current().tabs.current().files.openParent();
    });

    this.kbd.map('l', function() {
        self.panes.current().tabs.current().files.openCurrent();
    });
    this.kbd.map('<Cr>', function() {
        self.line.cmdline.text('');
        self.panes.current().tabs.current().files.openCurrent();
    }, ['normal', 'search']);

    this.kbd.map('tt', function() {
        var i = self.panes.current().tabs.open(
            self.panes.current().tabs.current()._path
        );
        self.panes.current().tabs.select(i);
    });

    this.kbd.map('tw', function() {
        self.panes.current().tabs.closeCurrent();
    });

    this.kbd.map('I', function() {
        self.panes.current().tabs.current().files.toggleHidden();
    });

    this.kbd.map('u', function() {
        // self.kbd.setMode('insert');
        // self.panes.current().tabs.pathbox.edit();
    });

    this.kbd.map('b', function() {
        self.tasks.toggle();
    });

    this.kbd.map('q', function() {
        self.saveState();
        backend.quit();
    }, 'normal');

    this.kbd.map('/', function() {
        self.kbd.setMode('search');
    }, 'normal');

    this.kbd.map('<Esc>', function() {
        self.kbd.setMode('normal');
    }, 'search');

    this.kbd.map('<C-[>', function() {
        self.kbd.setMode('normal');
    }, 'search');

    this.kbd.map('/', function() {
        self.kbd.setMode('normal');
    }, 'search');

    this.kbd.map('<C-h>', function() {
        self.line.cmdline.backspace();
        self.panes.current().tabs.current().files.search(self.line.cmdline.text());
    }, 'search');

    this.kbd.map('<C-w>', function() {
        self.line.cmdline.backword();
        self.panes.current().tabs.current().files.search(self.line.cmdline.text());
    }, 'search');

    this.kbd.map('K', function() {
        self.panes.current().tabs.current().files.selectPrev();
    }, 'search');

    this.kbd.map('J', function() {
        self.panes.current().tabs.current().files.selectNext();
    }, 'search');

    this.kbd.map('H', function() {
        self.line.cmdline.text('');
        self.panes.current().tabs.current().files.openParent();
    }, 'search');

    this.kbd.map('L', function() {
        self.line.cmdline.text('');
        self.panes.current().tabs.current().files.openCurrent();
    }, 'search');

    this.kbd.map('I', function() {
        self.panes.current().tabs.current().files.toggleHidden();
    }, 'search');

    this.kbd.map(/./, function(e) {
        self.line.cmdline.putText(e.getChar());
        // console.log(self.line.cmdline.text());
        self.panes.current().tabs.current().files.search(self.line.cmdline.text());
    }, 'search');

};

vicmd.UI.prototype = {

    _container: null,
    _current: null,

    panes: null,
    tasks: null,
    line: null,

    __init__: function(container) {
        this._container = $(container);
        this.panes = new vicmd.Panes(this._container.find('.panes'));
        this.tasks = new vicmd.Tasks(this._container.find('.tasks-wrapper').get(0));
        this.line = new vicmd.Line(this._container.find('.line-wrapper').get(0));
        this._current = 'panes';
    },

    current: function() {
        return this[this._current];
    },

    ready: function() {
        var self = this;
        setTimeout(function() {
            for(var t in self.panes.left.tabs._tabs)
                self.panes.left.tabs._tabs[t].files.current().select();
            delete t;
            for(var t in self.panes.right.tabs._tabs)
                self.panes.right.tabs._tabs[t].files.current().select();
        }, 400);
    },

    saveState: function() {
        backend.saveState({
            panes: this.panes.saveState()
        });
    }

};
