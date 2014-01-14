/**
 * Last Change: 2014 Jan 14, 12:59
 */

$(function() {

    // var kbd = new vicmd.Kbd({
        // showfunc: function(e) {
            // var el = document.getElementById('test');
            // if(e)
                // el.innerText += e.toString();
            // else
                // el.innerText = '';
        // }
    // });

    // kbd.map('J', function(e) {
        // console.log('down');
    // });

    // kbd.map('K', function(c) {
        // console.log('up');
    // });

    // kbd.map('<Esc>', function() {
        // console.log('Escape');
    // });

    // kbd.map('<C-[>', function() {
        // console.log('Esc');
    // })

    // kbd.map(/./, function(e) {
        // console.log(e.getChar());
    // });


    var box = new vicmd.EditBox({
        lines: 1,
        cols: 10
    });
    $('body').append(box);

    var kbd = new vicmd.Kbd();
    kbd.map('H', function() {
        box.cursor.moveX(-1);
    });
    kbd.map('L', function() {
        box.cursor.moveX(1);
    });
    kbd.map('J', function() {
        box.cursor.moveY(1);
    });
    kbd.map('K', function() {
        box.cursor.moveY(-1);
    });

    kbd.map('T', function() {
        console.log(box.area.currentLine().getTextBefore(box.cursor.pos().x));
        console.log(box.area.currentLine().getTextAfter(box.cursor.pos().x));
    });

    kbd.map('P', function() {
        box.putText('\n');
    });

    kbd.map('C', function() {
        box.text('new text');
    });

    kbd.map('W', function() {
        box.backword();
    });

    kbd.map(/.|\n/, function(e) {
        box.putText(e.getChar());
    });

    kbd.map('<C-h>', function() {
        box.backspace();
    });
    
    kbd.map('<C-d>', function() {
        box.del();
    });

    kbd.map('<C-c>', function() {
        if(box.cursor.type === 'block')
            box.cursor.setType('line');
        else
            box.cursor.setType('block');
    });

    kbd.map('<C-y>', function() {
        box.cursor.toggle();
    });

    box.text('okay something\nmore text');
    // box.putText('ok');
    // console.log(box.text(0));



});
