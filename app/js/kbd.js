/**
 * Last Change: 2013 Nov 15, 14:14
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
        showfunc: function() {},
        cancel_keys: ['<Esc>', '<C-[>']
    }, options);

    var self = this;
    var caps_pressed = false;
    var mappings = [];
    var current_mode = 'normal';
    var timer = -1;
    var wait_seqs = [];

    options.target.addEventListener('keydown', function(e) {
        // var event = new vicmd.Kbd.KeyEvt(e.originalEvent);
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
        return options.retval;
    });

    if(options.caps_as_ctrl) {
        options.target.bind('keyup', function(e) {
            if(e.keyCode === 20)
                caps_pressed = false;
        });
    }

    this.map = function(seq_str, action, mode) {
        mode = mode || 'normal';
        var seq = new vicmd.Kbd.KeySeq(seq_str);
        if(!mappings[mode])
            mappings[mode] = [];
        for(var s in mappings[mode]) {
            if(mappings[mode][s].equals(seq))
                throw new vicmd.Kbd.MappingExistsError(seq.toString(), mode);
        }
        seq.action = action;
        mappings[mode].push(seq);
    };

    this.setMode = function(mode) {
        current_mode = mode || normal;
    };

    function processEvent(event) {
        if(!mappings[current_mode])
            return;
        var seqs = wait_seqs.length ? wait_seqs.slice(0) : mappings[current_mode];
        wait_seqs = [];
        for(var s in seqs) {
            var seq = seqs[s];
            if(!seq.first().equals(event))
                continue;
            if(seq.len() == 1) {
                stopTimer();
                seq.action();
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

    for(var s_ in options.cancel_keys) {
        this.map(options.cancel_keys[s_], stopTimer);
    }

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
    if(typeof src === 'string')
        return this.fromString(src);
    else if(src instanceof Event)
        return this.fromEvent(src);
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

    equals: function(event) {
        return event.code === this.code
            && event.ctrl === this.ctrl
            && event.shift === this.shift
            && event.alt === this.alt;
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
    this._events = [];
    this.action = function() {};
    if(typeof src === 'string')
        return this.fromString(src);
    else if(typeof src === 'object')
        return this.fromEvents(src);
    else
        throw new vicmd.Kbd.InvalidArgumentError(
            typeof src, 'String or Array of Event objects');
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

    first: function() {
        return this._events[0];
    },

    cloneShifted: function() {
        var events = this._events.slice(0);
        events.shift();
        var seq = new vicmd.Kbd.KeySeq([]);
        seq._events = events;
        seq.action = this.action;
        return seq;
    },

    toString: function() {
        var res = [];
        for(var e in this._events)
            res.push(this._events[e].toString());
        return res.join('');
    },

    fromEvents: function(events) {
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
