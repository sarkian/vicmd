/**
 * Last Change: 2013 Nov 14, 12:18
 */

vicmd.File = function() {
    var self = document.createElement('div');
    self.class = 'test';
    self.test = function () {
        return 29;
    };
    return self;
};


// ###########################################

window.addEventListener('DOMContentLoaded', function() {

    window.f = new vicmd.File();
    // f.id = 'myel';
    $(f).attr('class', 'test');
    f.name = 'ok';
    document.body.appendChild(f);

    console.log($('.test')[0]);

});
