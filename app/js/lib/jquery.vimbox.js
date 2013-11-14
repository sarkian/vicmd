/**
 * Last Change: 2013 Nov 11, 20:38
 */

(function($) {

    jQuery.fn.vimbox = function(options) {

        options = $.extend({}, options);

        this.bind('keydown', function(e) {
            if(!e.ctrlKey) return;
            console.log(e.keyCode);
            switch(e.keyCode) {
                case 69:
                    processCtrlE(e);
                    break;
                case 76:
                    processCtrlL(e);
                    break;
                case 72:
                    processCtrlH(e);
                    break;
                case 87:
                    processCtrlW(e);
                    break;
            }
            return false;
        });

        function processCtrlE(e) {
            var pos = e.target.selectionStart - 1;
            e.target.setSelectionRange(pos, pos);
        }

        function processCtrlL(e) {
            var pos = e.target.selectionStart + 1;
            e.target.setSelectionRange(pos, pos);
        }

        function processCtrlH(e) {
            e.target.value = e.target.value.replace(/.$/, '');
        }

        function processCtrlW(e) {
            var val = e.target.value;
            val = val.replace(/[\s\t]+$/, '');
            e.target.value =
                val.replace(/[a-zA-Zа-яА-ЯёЁ0-9]+$|[^a-zA-Zа-яА-ЯёЁ0-9]$/, '');
        }

    };

})(jQuery);
