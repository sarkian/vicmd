/**
 * Last Change: 2013 Nov 15, 16:10
 */

$(function() {

    var kbd = new vicmd.Kbd({
        showfunc: function(e) {
            var el = document.getElementById('test');
            if(e)
                el.innerText += e.toString();
            else
                el.innerText = '';
        }
    });

    kbd.map('<count>j', function(c) {
        console.log('j: ' + c);
    });

    kbd.map('<count>dd', function(c) {
        console.log('dd: ' + c);
    });

    kbd.map('tt', function() {
        console.log('tt');
    });



});
