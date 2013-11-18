/**
 * Last Change: 2013 Nov 18, 21:20
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

    kbd.map('J', function(e) {
        console.log('down');
    });

    kbd.map('K', function(c) {
        console.log('up');
    });

    kbd.map('<Esc>', function() {
        console.log('Escape');
    });

    kbd.map('<C-[>', function() {
        console.log('Esc');
    })

    kbd.map(/./, function(e) {
        console.log(e.getChar());
    });


    var fname = 'MyFile';
    var query = 'myr';
    var exp = new RegExp(query, 'gi');
    console.log(exp.test(fname));


});
