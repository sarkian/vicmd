/**
 * Last Change: 2013 Dec 10, 01:40
 * TODO: lang support
 */

if(typeof vicmd === 'undefined')
    vicmd = {};


/*{{{ Kbd */
vicmd.Kbd = function(options) {

    options = $.extend({
        target: document.body,
        caps_as_ctrl: false,
        process_modifiers: false,
        retval: false,
        timeout: 1000,
        default_mode: 'normal',
        showfunc: function() {},
        onSetMode: function() {},
        cancel_keys: ['<Esc>', '<C-[>']
    }, options);

    var self = this;
    var caps_pressed = false;
    var mappings = [];
    var current_mode = '';
    var timer = -1;
    var wait_seqs = [];
    var cancel_seqs = [];

    for(var s_ in options.cancel_keys)
        cancel_seqs.push(new vicmd.Kbd.KeySeq(options.cancel_keys[s_]));

    options.target.addEventListener('keydown', function(e) {
        // var event = new vicmd.Kbd.KeyEvt(e.originalEvent); // if bind with jQuery
        var event = new vicmd.Kbd.KeyEvt(e);
        if(options.caps_as_ctrl) {
            if(event.code === 20) {
                caps_pressed = true;
                event.code = 17;
                event.ctrl = true;
            }
            else if(caps_pressed)
                event.ctrl = true;
        }
        if((!options.process_modifiers && event.isModifier()) || event.isUnknown())
            return options.retval;
        processEvent(event);
        e.preventDefault();
        return options.retval;
    });

    if(options.caps_as_ctrl) {
        options.target.bind('keyup', function(e) {
            if(e.keyCode === 20)
                caps_pressed = false;
        });
    }

    this.map = function(seq_str, action, mode) {
        if(mode instanceof Array) {
            for(var m in mode)
                this.map(seq_str, action, mode[m]);
            return;
        }
        mode = mode || options.default_mode;
        var seq = new vicmd.Kbd.KeySeq(seq_str);
        if(!mappings[mode])
            mappings[mode] = [];
        for(var s in mappings[mode]) {
            if(mappings[mode][s].equals(seq))
                throw new vicmd.Kbd.MappingExistsError(seq.toString(), mode);
        }
        seq._action = action;
        mappings[mode].push(seq);
    };

    this.setMode = function(mode) {
        mode = mode || options.default_mode;
        options.onSetMode(current_mode, mode);
        current_mode = mode;
    };

    function processEvent(event) {
        if(!mappings[current_mode])
            return;
        for(var cs in cancel_seqs) {
            if(cancel_seqs[cs].first().equals(event)) {
                var r = wait_seqs.length;
                stopTimer();
                if(r) return;
            }
        }
        var seqs = wait_seqs.length ? wait_seqs.slice(0) : mappings[current_mode];
        wait_seqs = [];
        for(var s in seqs) {
            var seq = seqs[s];
            if(event.isNumber() && seq.hasCount())
                wait_seqs.push(seq.cloneCounted(event.toString()));
            else if(!seq.first().equals(event))
                continue;
            else if(seq.len() == 1) {
                stopTimer();
                seq.processAction(event);
                return;
            }
            else {
                wait_seqs.push(seq.cloneShifted());
            }
        }
        if(wait_seqs.length) {
            timer = setTimeout(stopTimer, options.timeout);
            options.showfunc(event);
        }
        else
            stopTimer();
    }

    function stopTimer() {
        clearTimeout(timer);
        wait_seqs = [];
        options.showfunc();
    }

    this.setMode(options.default_mode);

};

vicmd.Kbd.prototype = {

};
/* Kbd }}}*/

/*{{{ key_chars */
vicmd.Kbd.key_chars = [];
vicmd.Kbd.key_chars[9]   = "Tab";
vicmd.Kbd.key_chars[13]  = "Cr";
vicmd.Kbd.key_chars[16]  = "Shift";
vicmd.Kbd.key_chars[17]  = "Ctrl";
vicmd.Kbd.key_chars[18]  = "Alt";
vicmd.Kbd.key_chars[20]  = "CapsLock";
vicmd.Kbd.key_chars[27]  = "Esc";
vicmd.Kbd.key_chars[32]  = "Space";
vicmd.Kbd.key_chars[48]  = "0";
vicmd.Kbd.key_chars[49]  = "1";
vicmd.Kbd.key_chars[50]  = "2";
vicmd.Kbd.key_chars[51]  = "3";
vicmd.Kbd.key_chars[52]  = "4";
vicmd.Kbd.key_chars[53]  = "5";
vicmd.Kbd.key_chars[54]  = "6";
vicmd.Kbd.key_chars[55]  = "7";
vicmd.Kbd.key_chars[56]  = "8";
vicmd.Kbd.key_chars[57]  = "9";
vicmd.Kbd.key_chars[65]  = "a";
vicmd.Kbd.key_chars[66]  = "b";
vicmd.Kbd.key_chars[67]  = "c";
vicmd.Kbd.key_chars[68]  = "d";
vicmd.Kbd.key_chars[69]  = "e";
vicmd.Kbd.key_chars[70]  = "f";
vicmd.Kbd.key_chars[71]  = "g";
vicmd.Kbd.key_chars[72]  = "h";
vicmd.Kbd.key_chars[73]  = "i";
vicmd.Kbd.key_chars[74]  = "j";
vicmd.Kbd.key_chars[75]  = "k";
vicmd.Kbd.key_chars[76]  = "l";
vicmd.Kbd.key_chars[77]  = "m";
vicmd.Kbd.key_chars[78]  = "n";
vicmd.Kbd.key_chars[79]  = "o";
vicmd.Kbd.key_chars[80]  = "p";
vicmd.Kbd.key_chars[81]  = "q";
vicmd.Kbd.key_chars[82]  = "r";
vicmd.Kbd.key_chars[83]  = "s";
vicmd.Kbd.key_chars[84]  = "t";
vicmd.Kbd.key_chars[85]  = "u";
vicmd.Kbd.key_chars[86]  = "v";
vicmd.Kbd.key_chars[87]  = "w";
vicmd.Kbd.key_chars[88]  = "x";
vicmd.Kbd.key_chars[89]  = "y";
vicmd.Kbd.key_chars[90]  = "z";
vicmd.Kbd.key_chars[91]  = "Win";
vicmd.Kbd.key_chars[186] = ";";
vicmd.Kbd.key_chars[187] = "=";
vicmd.Kbd.key_chars[188] = ",";
vicmd.Kbd.key_chars[189] = "-";
vicmd.Kbd.key_chars[190] = ".";
vicmd.Kbd.key_chars[191] = "/";
vicmd.Kbd.key_chars[192] = "`";
vicmd.Kbd.key_chars[219] = "[";
vicmd.Kbd.key_chars[220] = "\\";
vicmd.Kbd.key_chars[221] = "]";
vicmd.Kbd.key_chars[222] = "'"; 
/* key_chars }}}*/

/*{{{ shift_chars */
vicmd.Kbd.shift_chars = [];
vicmd.Kbd.shift_chars[32] = " ";
vicmd.Kbd.shift_chars[48] = ")";
vicmd.Kbd.shift_chars[49] = "!";
vicmd.Kbd.shift_chars[50] = "@";
vicmd.Kbd.shift_chars[51] = "#";
vicmd.Kbd.shift_chars[52] = "$";
vicmd.Kbd.shift_chars[53] = "%";
vicmd.Kbd.shift_chars[54] = "^";
vicmd.Kbd.shift_chars[55] = "&";
vicmd.Kbd.shift_chars[56] = "*";
vicmd.Kbd.shift_chars[57] = "(";
vicmd.Kbd.shift_chars[65]  = "A";
vicmd.Kbd.shift_chars[66]  = "B";
vicmd.Kbd.shift_chars[67]  = "C";
vicmd.Kbd.shift_chars[68]  = "D";
vicmd.Kbd.shift_chars[69]  = "E";
vicmd.Kbd.shift_chars[70]  = "F";
vicmd.Kbd.shift_chars[71]  = "G";
vicmd.Kbd.shift_chars[72]  = "H";
vicmd.Kbd.shift_chars[73]  = "I";
vicmd.Kbd.shift_chars[74]  = "J";
vicmd.Kbd.shift_chars[75]  = "K";
vicmd.Kbd.shift_chars[76]  = "L";
vicmd.Kbd.shift_chars[77]  = "M";
vicmd.Kbd.shift_chars[78]  = "N";
vicmd.Kbd.shift_chars[79]  = "O";
vicmd.Kbd.shift_chars[80]  = "P";
vicmd.Kbd.shift_chars[81]  = "Q";
vicmd.Kbd.shift_chars[82]  = "R";
vicmd.Kbd.shift_chars[83]  = "S";
vicmd.Kbd.shift_chars[84]  = "T";
vicmd.Kbd.shift_chars[85]  = "U";
vicmd.Kbd.shift_chars[86]  = "V";
vicmd.Kbd.shift_chars[87]  = "W";
vicmd.Kbd.shift_chars[88]  = "X";
vicmd.Kbd.shift_chars[89]  = "Y";
vicmd.Kbd.shift_chars[90]  = "Z";
vicmd.Kbd.shift_chars[186] = ":";
vicmd.Kbd.shift_chars[187] = "+";
vicmd.Kbd.shift_chars[188] = "<";
vicmd.Kbd.shift_chars[189] = "_";
vicmd.Kbd.shift_chars[190] = ">";
vicmd.Kbd.shift_chars[191] = "?";
vicmd.Kbd.shift_chars[192] = "~";
vicmd.Kbd.shift_chars[219] = "{";
vicmd.Kbd.shift_chars[220] = "|";
vicmd.Kbd.shift_chars[221] = "}";
vicmd.Kbd.shift_chars[222] = '"'; 
/* shift_chars }}}*/

/*{{{ key_codes */
vicmd.Kbd.key_codes = {
    "tab":        9,
    "cr":         13,
    "shift":      16,
    "ctrl":       17,
    "alt":        18,
    "capslock":   20,
    "esc":        27,
    "space":      32,
    "0":          48,
    "1":          49,
    "2":          50,
    "3":          51,
    "4":          52,
    "5":          53,
    "6":          54,
    "7":          55,
    "8":          56,
    "9":          57,
    "a":          65,
    "b":          66,
    "c":          67,
    "d":          68,
    "e":          69,
    "f":          70,
    "g":          71,
    "h":          72,
    "i":          73,
    "j":          74,
    "k":          75,
    "l":          76,
    "m":          77,
    "n":          78,
    "o":          79,
    "p":          80,
    "q":          81,
    "r":          82,
    "s":          83,
    "t":          84,
    "u":          85,
    "v":          86,
    "w":          87,
    "x":          88,
    "y":          89,
    "z":          90,
    "win":        91,
    ";":          186,
    "=":          187,
    ",":          188,
    "-":          189,
    ".":          190,
    "/":          191,
    "`":          192,
    "[":          219,
    "\\":         220,
    "]":          221,
    "'":          222, 
};
/* key_codes }}}*/

/*{{{ KeyEvt */
vicmd.Kbd.KeyEvt = function(src) {
    this.code = 0;
    this.ctrl = false;
    this.shift = false;
    this.alt = false;
    this._regexp = null;
    if(typeof src === 'string')
        return this.fromString(src);
    else if(src instanceof Event)
        return this.fromEvent(src);
    else if(src instanceof RegExp)
        return this.fromRegexp(src);
    else
        throw new vicmd.Kbd.InvalidArgumentError(
            src.constructor.name, 'Event');
};

vicmd.Kbd.KeyEvt.prototype = {

    isUnknown: function() {
        return this.code in vicmd.Kbd.key_chars == false;
    },

    isModifier: function() {
        return this.code === 16 || this.code === 17 || this.code === 18
            || this.code === 91;
    },

    isNumber: function() {
        return this.code >= 48 && this.code <= 57;
    },

    hasModifiers: function() {
        return this.ctrl || this.shift || this.alt;
    },

    equals: function(event) {
        if(this._regexp)
            return this._regexp.test(event.getChar());
        else
            return event.code === this.code
                && event.ctrl === this.ctrl
                && event.shift === this.shift
                && event.alt === this.alt;
    },

    getChar: function() {
        if(this.ctrl || this.alt) return '';
        if(this.code === 32) return ' ';
        if(this.code === 13) return '\n';
        if(this.code in vicmd.Kbd.shift_chars == false)
            return '';
        if(this.shift)
            return vicmd.Kbd.shift_chars[this.code];
        else
            return vicmd.Kbd.key_chars[this.code];
    },

    toString: function() {
        var mods = [];
        if(this.ctrl) mods.push('C');
        if(this.alt) mods.push('A');
        if(this.isUnknown())
            return '<Unknown>';
        if(this.isModifier()) {
            if(this.shift) mods.push('S');
            return '<' + mods.join('-') + '>';
        }
        var key = vicmd.Kbd.key_chars[this.code];
        if(key.length > 1) {
            if(this.shift) mods.push('S');
            mods.push(key);
            return '<' + mods.join('-') + '>';
        }
        else {
            if(mods.length) {
                if(this.shift) mods.push('S');
                mods.push(key); 
                return '<' + mods.join('-') + '>';
            }
            else {
                if(this.shift) key = key.toUpperCase();
                return key;
            }
        }
    },

    fromEvent: function(event) {
        this.code = event.keyCode;
        this.ctrl = event.ctrlKey;
        this.shift = event.shiftKey;
        this.alt = event.altKey;
        return this;
    },

    fromString: function(str) {
        if(str[0] === '<') {
            str = str.replace(/^\<|\>$/g, '').toLowerCase().split('-');
            var mod_cnt = str.length - 1;
            for(k in str) {
                var key = str[k];
                if(!key.trim().length)
                    throw new vicmd.Kbd.InvalidSequenceError(str);
                if(k < mod_cnt) {
                    if(key in vicmd.Kbd.KeyEvt.modkey_abbrs == false)
                        throw new vicmd.Kbd.InvalidSequenceError(str);
                    var mod = vicmd.Kbd.KeyEvt.modkey_abbrs[key];
                    if(this[mod])
                        throw new vicmd.Kbd.InvalidSequenceError(str);
                    this[mod] = true;
                }
                else {
                    if(key in vicmd.Kbd.key_codes == false)
                        throw new vicmd.Kbd.InvalidSequenceError(str);
                    this.code = vicmd.Kbd.key_codes[key];
                }
            }
        }
        else {
            key = str.toLowerCase();
            if(key in vicmd.Kbd.key_codes == false)
                throw new vicmd.Kbd.InvalidSequenceError(str);
            if(key !== str)
                this.shift = true;
            this.code = vicmd.Kbd.key_codes[key];
        }
        return this;
    },

    fromRegexp: function(exp) {
        this._regexp = exp;
        return this;
    }

};

vicmd.Kbd.KeyEvt.modkey_abbrs = {
    'c': 'ctrl',
    'a': 'alt',
    's': 'shift'
};
/* KeyEvt }}}*/

/*{{{ KeySeq */
vicmd.Kbd.KeySeq = function(src) {
    this._has_count = false;
    this._count = '';
    this._events = [];
    this._action = function() {};
    if(typeof src === 'string')
        return this.fromString(src);
    else if(src instanceof Array)
        return this.fromArray();
    else if(src instanceof RegExp)
        return this.fromRegexp(src);
    else
        throw new vicmd.Kbd.InvalidArgumentError(
            typeof src, 'String or Array');
};

vicmd.Kbd.KeySeq.prototype = {

    equals: function(seq) {
        if(this._events.length !== seq._events.length)
            return false;
        for(s in seq._events) {
            if(!this._events[s] || !this._events[s].equals(seq._events[s]))
                return false;
        }
        return true;
    },

    len: function() {
        return this._events.length;
    },

    hasCount: function() {
        return this._has_count;
    },

    first: function() {
        return this._events[0];
    },

    cloneShifted: function() {
        var events = this._events.slice(0);
        events.shift();
        var seq = new vicmd.Kbd.KeySeq([]);
        seq._has_count = this._has_count;
        seq._count = this._count;
        seq._events = events;
        seq._action = this._action;
        return seq;
    },

    cloneCounted: function(count) {
        var seq = new vicmd.Kbd.KeySeq([]);
        seq._has_count = this._has_count;
        seq._count = this._count + count;
        seq._events = this._events.slice(0);
        seq._action = this._action;
        return seq;
    },

    processAction: function(e) {
        if(this._has_count)
            this._action(e, this._count.length ? parseInt(this._count) : 1);
        else
            this._action(e);
    },

    toString: function() {
        var res = [];
        for(var e in this._events)
            res.push(this._events[e].toString());
        return res.join('');
    },

    fromRegexp: function(exp) {
        this._events.push(new vicmd.Kbd.KeyEvt(exp));
    },

    fromArray: function(events) {
        for(var i in events)
            this._events.push(new vicmd.KbdEvt(events[i]));
    },

    fromString: function(str) {
        var parts = str.trim().match(
                /\<[a-z0-9\`\-\=\[\]\\\;\'\,\.\/]+\>|[a-z0-9\`\-\=\[\]\\\;\'\,\.\/]/gi);
        if(parts.join('') !== str)
            throw new vicmd.Kbd.InvalidSequenceError(str);
        var s, part;
        for(s in parts) {
            if(s == 0 && parts[s].toLowerCase() === '<count>')
                this._has_count = true;
            else
                this._events.push(new vicmd.Kbd.KeyEvt(parts[s]));
        }
        return this;
    }

};
/* KeySeq }}}*/


/*{{{ Errors */
vicmd.Kbd.InvalidSequenceError = function(seq) {
    this.name = 'InvalidSequenceError';
    this.message = 'Invalid sequence: ' + seq;
};
vicmd.Kbd.InvalidSequenceError.prototype = Error.prototype;
vicmd.Kbd.InvalidSequenceError.prototype.constructor = vicmd.Kbd.InvalidSequenceError;

vicmd.Kbd.InvalidArgumentError = function(passed, expected) {
    this.name = 'InvalidArgumentError';
    this.message = 'Expected: ' + expected + '; Passed: ' + passed;
};
vicmd.Kbd.InvalidArgumentError.prototype = Error.prototype;
vicmd.Kbd.InvalidArgumentError.prototype.constructor = vicmd.Kbd.InvalidArgumentError;

vicmd.Kbd.MappingExistsError = function(seq, mode) {
    this.name = 'MappingExistsError';
    this.message = 'Sequence already mapped: ' + seq + ' (mode: ' + mode + ')';
};
vicmd.Kbd.MappingExistsError.prototype = Error.prototype;
vicmd.Kbd.MappingExistsError.prototype.constructor = vicmd.Kbd.MappingExistsError;
/* Errors }}}*/


// ################################################

vicmd.Kbd.printKeyChars = function() {
    var res = [], ch;
    for(var i in vicmd.Kbd.key_chars) {
        ch = vicmd.Kbd.key_chars[i].replace('\\', '\\\\');
        res.push('vicmd.Kbd.key_chars[' + i + ']'
            + (new Array(4 - i.toString().length).join(' '))
            + ' = "' + ch + '";');
    }
    console.log(res.join('\n'));
}

vicmd.Kbd.printKeyCodesFromChars = function() {
    var res = [], ch;
    for(var i in vicmd.Kbd.key_chars) {
        ch = vicmd.Kbd.key_chars[i].replace('\\', '\\\\');
        res.push('"' + ch + '":'
            + (new Array(12 - ch.length).join(' '))
            + i + ',');
    }
    console.log(res.join('\n'));
};


// vim:foldmethod=marker
